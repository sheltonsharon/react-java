package com.servlet;

import java.beans.PropertyVetoException;
import java.sql.Connection;
import java.sql.SQLException;

import com.mchange.v2.c3p0.*;

public class MyConnection 
{
	static ComboPooledDataSource cpds1;
	static String dbDriver;
	static
	{
		cpds1 = new ComboPooledDataSource();
		dbDriver = "org.postgresql.Driver";
		String dbName = "jdbc:postgresql://localhost/postgres";
		cpds1.setJdbcUrl(dbName);
		String userName = "user_1";
		cpds1.setUser(userName);
		String password = "mypass";
		cpds1.setPassword(password);
		cpds1.setMaxStatements( 180 );
	}
	public static Connection getConnection() throws PropertyVetoException, SQLException 
	{   
		cpds1.setDriverClass(dbDriver);
		return cpds1.getConnection();
	}
}
