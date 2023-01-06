package com.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;

public class CheckUserLevel extends HttpServlet 
{
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
	{
		PrintWriter out = response.getWriter();
		out.print("CalcServlet");
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		HttpSession session = request.getSession(false);
		response.setContentType("application/json");
		JSONObject jsonData = new JSONObject();
		PrintWriter out = response.getWriter();
		try 
		{
			if(session == null)
			{
				jsonData.put("status", "deny");
			}
			else if(session.getAttribute("role").equals("admin"))
			{
				jsonData.put("status","admin");
			}
			else
			{
				jsonData.put("status", "user");
			}
			out.print(jsonData);
		} 
		catch (JSONException e) 
		{
			e.printStackTrace();
		}
	}
}