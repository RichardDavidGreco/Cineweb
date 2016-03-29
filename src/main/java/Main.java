import static spark.Spark.*;

import java.io.*;
import java.util.ArrayList;
import java.util.Random;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

public class Main {
	private static ArrayList<String> accessTokenList = new ArrayList<String>();
	
    @SuppressWarnings("unchecked")
	public static void main(String[] args) throws IOException, ParseException {
    	staticFileLocation("/public");
    	Object obj = new JSONParser().parse(leggiFile("users.json"));
    	JSONObject Juser = (JSONObject)obj;
    	obj = new JSONParser().parse(leggiFile("sale.json"));
    	JSONObject Jsale = (JSONObject)obj;
    	obj = new JSONParser().parse(leggiFile("palinsesto.json"));
    	JSONArray Jpal = (JSONArray)obj;
    	obj = new JSONParser().parse(leggiFile("prenotazioni.json"));
    	JSONArray Jpre = (JSONArray)obj;
    	obj = null;
    	
    	get("/", (req, res) -> {
    		res.redirect("/index.html");
    		return null;
    	});
    	
    	get("/info", (req, res) -> {
    		boolean go = true;
    		JSONObject ret = new JSONObject();
    		String[] arr = new String[4];
    		while(go){
	    		try{
		    		arr = getInfo();
		    		go = false;
	    		} catch(Exception e){
	    			System.err.println("Errore "+e.toString());
	    		}
    		}
    		ret.put("title", arr[0]);
    		ret.put("link", arr[1]);
    		ret.put("text", arr[2]);
    		ret.put("image", arr[3]);
    		res.header("Content-type", "application/json");
    		res.status(200);
        	return ret;
        });
    	
    	get("/login", (req, res) -> {
    		String ml = req.queryParams("mail");
    		String pssw = req.queryParams("pssw");
    		JSONObject user = (JSONObject)(Juser.get(ml));
    		if(user==null){
				res.type("text/plain");
				return "non_registrato";
    		} else if(!((String)user.get("pssw")).equals(pssw)){
				res.type("text/plain");
				return "password_errata";
    		}
    		res.status(200);
    		String token = getToken((String)(user.get("name")), ml);
    		res.header("Authorization", token);
    		res.type("application/json");
    		String ritorno = user.toString();
    		Object Jrit = new JSONParser().parse(ritorno);
    		((JSONObject)Jrit).remove("pssw");
    		((JSONObject)Jrit).put("mail", ml);
        	return (JSONObject)Jrit;
        });
    	
    	post("/register", (req, res) -> {
        	JSONObject Nobj = new JSONObject();
        	if(Juser.get(req.queryParams("mail"))!=null){
        		res.status(200);
        		res.type("text/plain");
        		return "esiste";
        	}
        	Nobj.put("pssw", req.queryParams("pssw"));
        	Nobj.put("name", req.queryParams("name"));
        	Nobj.put("lastname", req.queryParams("last"));
        	Nobj.put("town", req.queryParams("town"));
        	Nobj.put("date", req.queryParams("date"));
        	Juser.put(req.queryParams("mail"), Nobj);
        	res.status(200);
        	res.type("text/plain");
        	update(Juser, "users.json", true);
        	return "Registrazione confermata!";
        });
    	
    	put("/logout", (req, res) -> {
    		accessTokenList.remove(req.headers("Authorization"));
    	    res.status(200);
    	    return "OK";
    	});
    	
    	get("/film", (req, res) -> {
    		String token = req.headers("Authorization");
    		if(token==null || !accessTokenList.contains(token)){
    			res.type("text/plain");
    			return "NotAuthorized";
    		}
    		ArrayList<String> flms = new ArrayList<String>();
    		for(Object f: Jpal){
    			JSONObject film = (JSONObject)f;
    			flms.add((String)film.get("film"));
    		}
    		res.status(200);
    		res.type("text/plain");
    		return flms.toString().substring(1, flms.toString().length()-1);
        });
    	
    	get("/film/giorni", (req, res) -> {
    		String token = req.headers("Authorization");
    		if(token==null || !accessTokenList.contains(token)){
    			res.type("text/plain");
    			return "NotAuthorized";
    		}
    		String film = req.queryParams("film");
    		ArrayList<String> days = new ArrayList<String>();
    		JSONArray ret = new JSONArray();
    		for(Object f: Jpal){
    			JSONObject fl = (JSONObject)f;
    			if(((String)fl.get("film")).equals(film)){
    				ret = (JSONArray)fl.get("info");
    				break;
    			}
    		}
    		for(Object d: ret){
    			JSONObject day = (JSONObject)d;
    			days.add((String)day.get("giorno"));
    		}
    		res.status(200);
    		res.type("text/plain");
    		return days.toString().substring(1, days.toString().length()-1);
        });
    	
    	get("/film/giorni/ora", (req, res) -> {
    		String token = req.headers("Authorization");
    		if(token==null || !accessTokenList.contains(token)){
    			res.type("text/plain");
    			return "NotAuthorized";
    		}
    		String film = req.queryParams("film");
    		String giorno = req.queryParams("giorno");
    		ArrayList<String> hours = new ArrayList<String>();
    		JSONArray ret = new JSONArray();
    		for(Object f: Jpal){
    			JSONObject fl = (JSONObject)f;
    			if(((String)fl.get("film")).equals(film))
	    			for(Object d: (JSONArray)fl.get("info")){
	    				JSONObject day = (JSONObject)d;
	    				if(((String)day.get("giorno")).equals(giorno)){
	    					ret = (JSONArray)day.get("ore");
	    					break;
	    				}
	    			}
    		}
    		for(Object h: ret){
    			JSONObject hr = (JSONObject)h;
    			hours.add((String)hr.get("ora"));
    		}
    		res.status(200);
    		res.type("text/plain");
    		return hours.toString().substring(1, hours.toString().length()-1);
        });
    	
    	get("/film/giorni/ora/sala", (req, res) -> {
    		String token = req.headers("Authorization");
    		if(token==null || !accessTokenList.contains(token)){
    			res.type("text/plain");
    			return "NotAuthorized";
    		}
    		String film = req.queryParams("film");
    		String giorno = req.queryParams("giorno");
    		String ora = req.queryParams("ora");
    		JSONObject Juse = new JSONObject();
    		for(Object o: Jpal)
    			if(((String)((JSONObject)(o)).get("film")).equals(film)){
    				Juse = (JSONObject)(o);
    				break;
    			}
    		for(Object o: (JSONArray)Juse.get("info"))
    			if(((String)((JSONObject)(o)).get("giorno")).equals(giorno)){
    				Juse = (JSONObject)(o);
    				break;
    			}
    		for(Object o: (JSONArray)Juse.get("ore"))
    			if(((String)((JSONObject)(o)).get("ora")).equals(ora)){
    				Juse = (JSONObject)(o);
    			}
    		res.status(200);
    		res.type("text/plain");
    		return (String)Juse.get("sala");
        });
    	
    	get("/sala", (req, res) -> {
    		String sala = req.queryParams("numero");
    		if(Jsale.get(sala)==null){
    			res.status(404);
				res.type("text/plain");
				return "nope";
    		}
    		JSONArray file = (JSONArray)(((JSONObject)(((JSONObject)Jsale.get(sala)).get("info_posti"))).get("file"));
    		res.status(200);
    		res.type("application/json");
        	return file.toJSONString();
        });
    	
    	get("/prenotati", (req, res) -> {
    		String film = req.queryParams("film");
    		String giorno = req.queryParams("giorno");
    		String ora = req.queryParams("ora");
    		JSONArray prenotati = new JSONArray();
    		for(Object f: Jpre)
    			if(film.equals((String)((JSONObject)(f)).get("film")) && giorno.equals((String)((JSONObject)(f)).get("giorno")) && ora.equals((String)((JSONObject)(f)).get("ora"))){
    				for(Object p: (JSONArray)((JSONObject)f).get("prenotati"))
    					for(Object c: (JSONArray)((JSONObject)p).get("posti"))
    						prenotati.add((JSONObject)c);
    				break;
    			}
    		res.status(200);
    		res.type("application/json");
    		return prenotati;
    	});
    	
    	get("/palinsesto", (req, res) -> {
    		res.status(200);
    		res.type("application/json");
    		return Jpal.toJSONString();
        });
    	
    	post("/prenota", (req, res) -> {
    		String token = req.headers("Authorization");
    		boolean esisteFilm = false;
    		boolean esisteUtente = false;
    		if(token==null || !accessTokenList.contains(token)){
    			res.type("text/plain");
    			return "NotAuthorized";
    		}
    		String[] posti = req.queryParams("prenotati").split(",");
    		if(posti[0].equals("")){
    			res.type("text/plain");
    			return "non_selezionati";
    		}
    		String film = req.queryParams("film");
    		String giorno = req.queryParams("giorno");
    		String ora = req.queryParams("ora");
    		String user = req.queryParams("user");
    		for(Object f: Jpre)
    			if(film.equals((String)((JSONObject)(f)).get("film")) && giorno.equals((String)((JSONObject)(f)).get("giorno")) && ora.equals((String)((JSONObject)(f)).get("ora"))){
    				esisteFilm = true;
    				for(Object h: (JSONArray)((JSONObject)f).get("prenotati"))
    					if(user.equals((String)((JSONObject)h).get("utente"))){
    						esisteUtente = true;
    						JSONArray pos = (JSONArray)(((JSONObject)h).get("posti"));
    						for(String s: posti){
    							JSONObject cod = new JSONObject();
    							cod.put("codice", s);
    							pos.add(cod);
    						}
    						System.out.println(pos.toString());
    						break;
    					}
    			}
    		if(!esisteFilm){
    			JSONObject ins = new JSONObject();
    			ins.put("film", film);
    			ins.put("giorno", giorno);
    			ins.put("ora", ora);
    			JSONArray prenotati = new JSONArray();
    			ins.put("prenotati", prenotati);
    			JSONObject utente_posti = new JSONObject();
    			utente_posti.put("utente", user);
    			utente_posti.put("posti", new JSONArray());
    			prenotati.add(utente_posti);
    			JSONArray pos = (JSONArray)utente_posti.get("posti");
    			for(String s: posti){
    				JSONObject p = new JSONObject();
    				p.put("codice", s);
    				pos.add(p);
    			}
    			Jpre.add(ins);
    		} else if(!esisteUtente){
    			System.out.println("Entrato in !esisteUtente\n"+Jpre.toJSONString());
    			for(Object o: Jpre)
    				if(film.equals((String)((JSONObject)(o)).get("film")) && giorno.equals((String)((JSONObject)(o)).get("giorno")) && ora.equals((String)((JSONObject)(o)).get("ora"))){
    					JSONArray prenotati = (JSONArray)((JSONObject)o).get("prenotati");
    					JSONObject utente_posti = new JSONObject();
    	    			utente_posti.put("utente", user);
    	    			utente_posti.put("posti", new JSONArray());
    	    			prenotati.add(utente_posti);
    	    			JSONArray pos = (JSONArray)utente_posti.get("posti");
    	    			for(String s: posti){
    	    				JSONObject p = new JSONObject();
    	    				p.put("codice", s);
    	    				pos.add(p);
    	    			}
    	    			break;
    				}
    			System.out.println(Jpre.toJSONString());
    		}
    		update(Jpre, "prenotazioni.json", false);
    		res.status(200);
    		res.type("text/plain");
    		return "Prenotazione_Avvenuta";
        });
    }

	private static String leggiFile(String s) throws IOException, ParseException {
		File fl = new File(s);
		FileReader fr = new FileReader(fl);
		BufferedReader br = new BufferedReader(fr);
		String var = br.readLine();
		br.close();
		return var;
	}
	
	private static void update(Object obj, String filename, boolean b) throws IOException{
		File fl = new File(filename);
		FileWriter fw = new FileWriter(fl);
		BufferedWriter bw = new BufferedWriter(fw);
		if(b)		
			bw.write(((JSONObject)obj).toJSONString());
		else
			bw.write(((JSONArray)obj).toJSONString());
		bw.close();
	}
	
	private static String getToken(String name, String mail){
		String token = "";
		for(int i=0; i<name.length() && i<mail.length(); i++)
			token = token+name.charAt(i)+mail.charAt(i);
		accessTokenList.add(token);
		return token;
	}
	
	private static String[] getInfo() throws IOException{
		int i = new Random().nextInt(24);
		String[] arr = new String[4];
		Document doc = Jsoup.connect("http://www.comingsoon.it/").get();
		arr[0] = doc.getElementsByClass("item-film").get(i).getElementsByTag("a").get(0).attr("title");
		arr[1] = "http://www.comingsoon.it/"+doc.getElementsByClass("item-film").get(i).getElementsByTag("a").get(0).attr("href");
		arr[3] = doc.getElementsByClass("item-film").get(i).getElementsByTag("img").get(0).attr("src");
		doc = Jsoup.connect(arr[1]).get();
		arr[2] = doc.getElementsByClass("contenuto-scheda-destra").get(0).getElementsByTag("p").text();
		return arr;
	}
}