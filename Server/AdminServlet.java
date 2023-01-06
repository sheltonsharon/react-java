package com.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import com.google.gson.Gson;

public class AdminServlet extends HttpServlet 
{
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		response.setHeader("Access-Control-Allow-Credentials", "true");
		PrintWriter writer = response.getWriter();
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
				.query(QueryBuilders.matchAllQuery())
				.size(1000)
				.timeout(new TimeValue(1000, TimeUnit.SECONDS));
		SearchRequest searchRequest = new SearchRequest("cmdlgs").source(searchSourceBuilder);
		RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(new HttpHost("localhost", 9200, "http")));
		try 
		{
			SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
			List<String> logs = new ArrayList<String>();
			Gson gson = new Gson();
			if (searchResponse.getHits().getTotalHits().value > 0)
				for(SearchHit hit : searchResponse.getHits())
					logs.add(gson.toJson(hit.getSourceAsMap()));
			System.out.println(logs.toString());
			writer.print(logs.toString());
		} 
		catch (IOException e) 
		{ 
			e.printStackTrace(); 
		}
	}
}