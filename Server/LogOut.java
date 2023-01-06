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

public class LogOut extends HttpServlet 
{
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
	{
		PrintWriter out = response.getWriter();
		out.print("CalcServlet");
	}
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException
	{
		HttpSession session = request.getSession();
		System.out.print((String)session.getAttribute("uname"));
		response.setContentType("application/json");
		session.invalidate();
		JSONObject jsonData = new JSONObject();
		try 
		{
			PrintWriter out = response.getWriter();
			jsonData.put("response_code", 200);
			out.print(jsonData);
		} 
		catch (Exception e) 
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
