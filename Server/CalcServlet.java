package com.servlet;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.http.HttpHost;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
//import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

public class CalcServlet extends HttpServlet
{
	static List<String> lines;
	static String regex_var;

	public static void sort()
	{
		Collections.sort(lines);
	}
	
	public static void uniq()
	{
		List<String> list1 = new ArrayList<String>();
		for(int i=0; i<lines.size(); i++)
		{
			if(i==0)
			{
				list1.add(lines.get(i));
			}
			else if(!(lines.get(i).equals(lines.get(i-1))))
			{
				list1.add(lines.get(i));
			}
		}
		lines = list1;
	}
	
	public static void regex()
    {
		List<String> list1 = new ArrayList<String>();
		Pattern pattern = Pattern.compile(regex_var);
		for(String i:lines)
		{
			Matcher m = pattern.matcher(i);
			if(m.find())
			{
				list1.add(i);
			}
		}
		lines = list1;
	}
	
	public static void trim()
    {
		lines = lines.stream().map(String::trim).collect(Collectors.toList());
	}
	
	public static void wc()
	{
		List<String> list1 = new ArrayList<String>();
		int characters = 0,line = 0,words = 0, index = 0;
	    for(String i:lines)
	    {
	        characters+= i.length();
	        line++;
	        index = 0;
	        for (char c : i.trim().toCharArray()) 
            {
	            if (c == ' ') 
                {
	               index++;
	            }
	        }
		    words += index;
	    }
	    list1.add(Integer.toString(line)+" lines");
	    list1.add(Integer.toString(words+line)+" words");
	    list1.add(Integer.toString(characters+line)+" characters");
		lines = list1;
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
	{
		PrintWriter out = response.getWriter();
		out.print("CalcServlet");
	}
    
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		response.setContentType("application/json");
	    JSONObject jObj;
	    JSONObject jo = new JSONObject();
		try 
        {
			HttpSession session = request.getSession();
	    	jObj = UtilityClass.getJSON(request);
			lines = new ArrayList<String>(Arrays.asList(((String) jObj.get("text")).split("\n")));
			regex_var = (String) jObj.get("reg");
			String[] commands = ((String) jObj.get("commands")).split(",");
			RestHighLevelClient client = new RestHighLevelClient(
			RestClient.builder(new HttpHost("localhost", 9200, "http"))) ;
			DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");  
			LocalDateTime now = LocalDateTime.now();
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("time", dtf.format(now));
			map.put("username", (String) session.getAttribute("uname")); 
			map.put("commands", (String) jObj.get("commands"));  
			System.out.println(dtf.format(now)); 
			IndexRequest indexRequest = new IndexRequest("cmdlgs");
			indexRequest.source(map);
			IndexResponse indexResponse = client.index(indexRequest, RequestOptions.DEFAULT);
			for (String a : commands)
			{
				switch (a) 
                {
				case "sort":
					sort();
					break;
				case "uniq":
					uniq();
					break;
				case "trim":
					trim();
					break;
				case "regex":
					regex();
					break;
				case "wc":
					wc();
					break;
				default:
					break;
				}
			}
			jo.put("output", String.join(",",lines));
			PrintWriter writer = response.getWriter();
			writer.print(jo);
		} 
		catch (JSONException e) 
		{
			e.printStackTrace();
		}
	}	
}