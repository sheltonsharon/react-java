package com.servlet;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.*;
import org.json.JSONObject;
import org.mindrot.jbcrypt.BCrypt;

public class SignUpServlet extends HttpServlet
{	
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
	{
		PrintWriter out = response.getWriter();
		out.print("Signup servlet");
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		response.setContentType("application/json");
		PrintWriter writer = response.getWriter();
		JSONObject jo = new JSONObject();
	    JSONObject jObj;
	    try
        {
	    	jObj = UtilityClass.getJSON(request);
			String uname = ((String) jObj.get("uname"));
			String pass = ((String) jObj.get("pass"));
			Statement stmt = null;
			Connection con = null;
			PreparedStatement ps;
            ResultSet rs = null;
	    	try
            {
	            con = MyConnection.getConnection();
	            System.out.println("Got Connection");
	            con.setAutoCommit(false);
	            String sql = "SELECT * FROM users WHERE username = ?";
	            ps = con.prepareStatement(sql);
	            ps.setString(1, uname);
	            rs = ps.executeQuery();
	            if(rs.next())
	            {
	            	jo.put("status", "duplicate");
					writer.print(jo);
					return;
	            }
	            stmt = con.createStatement();
	            String hashPass = BCrypt.hashpw(pass, BCrypt.gensalt());
	            sql = "INSERT INTO users(username,password) VALUES (?,?)";
	            ps = con.prepareStatement(sql);
	            ps.setString(1, uname);
	            ps.setString(2, hashPass);
	            int i = ps.executeUpdate();
	            con.commit();
	            System.out.println(i+" records inserted"); 
	            jo.put("status", "inserted");
				writer.print(jo);
	    	}
	    	catch (Exception e) 
            {
	    		e.printStackTrace();
	    		System.out.println("Not Connected");
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