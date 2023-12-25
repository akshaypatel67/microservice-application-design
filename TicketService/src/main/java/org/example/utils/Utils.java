package org.example.utils;

import com.google.gson.Gson;

import java.util.HashMap;
import java.util.Map;

public class Utils {
    private static final Gson gson = new Gson();
    public static Map<String, String> jsonDeserialize(String json) {
        Map<String, String> map = new HashMap<>();
        map = (Map<String, String>) gson.fromJson(json, map.getClass());

        return map;
    }

    public static String jsonSerialization(Map<String, String> map) {
        String json = gson.toJson(map, map.getClass());

        return json;
    }


}
