package com.invert.jazmyn;

import java.awt.*;

import static spark.Spark.*;

public class Jazmyn {


    private static Jazmyn instance;
    private Mouse mouse;
    private static final int PORT = 5966;

    public static void main(String[] args) {
        System.out.println("Starting com.invert.jazmyn.Jazmyn:");
        instance = new Jazmyn();
        instance.startServer();
    }



    public Jazmyn(){
        port(PORT);
        try {
            mouse = new Mouse();
        }catch (AWTException e){
            System.out.println("Cannot create mouse");
            System.out.println(e.getMessage());
        }
    }


    private void startServer(){
        staticFiles.location("/public");

        get("/click/:x/:y/:double", (req, res) -> {
            mouse.click(Integer.parseInt(req.params(":x")), Integer.parseInt(req.params(":y")));
            if(Boolean.parseBoolean(req.params(":double"))){
                mouse.click();
            }
            return true;
        });

        get("/getMousePos", (req, res) -> {
            Point p = mouse.getPos();
            res.status(200);
            res.type("application/json");
            return  "{\"x\":" + p.x + ", \"y\":" + p.y +"}";
        });


        /* Shut down */
        get("/shutdown", (req, res) -> {
            stop();
            return "Goodbye";
        });

        System.out.println("Listening on port: " + PORT);
    }
}
