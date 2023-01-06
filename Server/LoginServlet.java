package com.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.apache.http.HttpHost;
//import org.elasticsearch.action.search.SearchRequest;
//import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.core.TimeValue;
//import org.elasticsearch.index.query.QueryBuilders;
//import org.elasticsearch.search.SearchHit;
//import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.json.JSONObject;
import org.mindrot.jbcrypt.BCrypt;

import com.google.gson.Gson;

public class LoginServlet extends HttpServlet
{
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
	{
		PrintWriter out = response.getWriter();
		out.print("Login servlet");
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
		PrintWriter writer = response.getWriter();
		JSONObject jo = new JSONObject();
	    JSONObject jObj;
	    Statement stmt = null;
		Connection con = null;
		PreparedStatement ps;
        ResultSet rs = null;
	    try
	    {
	    	jObj = UtilityClass.getJSON(request);
			String uname = ((String) jObj.get("uname"));
			String pass = ((String) jObj.get("pass"));
            String sql = "SELECT * FROM users WHERE username = ?";
	    	try
	    	{
	            con = MyConnection.getConnection();
	            System.out.println("Got Connection");      
	            stmt = con.createStatement();
	            ps = con.prepareStatement(sql);
	            ps.setString(1, uname);
	            rs = ps.executeQuery();
	            if(rs.next())
	            {
	            	if(BCrypt.checkpw(pass,rs.getString("password")))
	            	{
	            		HttpSession session = request.getSession();
	            		session.setAttribute("uname", uname);
	            		System.out.println((String) session.getAttribute("uname"));
	            		if(uname.equals("admin"))
	            		{
	            			session.setAttribute("role", "admin");
	            			jo.put("status", "admin");
	            		}
	            		else
	            		{
	            			session.setAttribute("role", "user");
	            			jo.put("status", "authenticate");
	            		}
	            	}
	            	else
	            	{
	            		jo.put("status", "deny");
	            	}
	            }
	            else
	            {
	            	jo.put("status", "deny");
	            }
	            writer.print(jo);
	    	}
	    	catch (Exception e) 
            {
	    		e.printStackTrace();
			}
	    	finally 
            {
	    		if(rs != null)
	    		{
	    			rs.close();
	    		}
	    		if(stmt != null)
	    		{
	    			stmt.close();
	    		}
	            if(con != null)
	            {
	            	con.close();
	            }
			}
	    }
	    catch(Exception e)
	    {
	    	e.printStackTrace();
	    }
	}
}