package com.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONException;
import org.json.JSONObject;

public class UtilityClass 
{
	public static JSONObject getJSON(HttpServletRequest request) throws IOException
	{
		String jsonBody = new BufferedReader(new InputStreamReader(request.getInputStream())).lines().collect(
	            Collectors.joining("\n"));
	    JSONObject jObj;
	    try 
	    {
			jObj = new JSONObject(jsonBody);
			return jObj;
		} 
	    catch (JSONException e) 
	    {
			e.printStackTrace();
			return null;
		}
    }
}
