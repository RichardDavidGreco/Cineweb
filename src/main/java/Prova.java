import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;


public class Prova {
	public static void main(String []args) throws ParseException, IOException{
		Object obj = new JSONParser().parse(leggiFile("palinsesto.json"));
		JSONArray Jpal = (JSONArray)obj;
		String film = "Il mio grosso grasso matrimonio greco";
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
		System.out.println(days.toString());
	}
	
	private static String leggiFile(String s) throws IOException, ParseException {
		File fl = new File(s);
		FileReader fr = new FileReader(fl);
		BufferedReader br = new BufferedReader(fr);
		String var = br.readLine();
		br.close();
		return var;
	}
}
