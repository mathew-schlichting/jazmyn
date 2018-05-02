package com.invert.jazmyn;

import java.awt.*;
import java.io.*;

import static java.lang.System.out;
import static spark.Spark.*;

public class Jazmyn {


    private static Jazmyn instance;
    private Mouse mouse;
    private Keyboard keyboard;
    private static final int PORT = 5966;

    public static void main(String[] args) {
        out.println("Starting Jazmyn:");
        instance = new Jazmyn();
        instance.startServer();
    }



    public Jazmyn(){
        port(PORT);
        try {
            mouse = new Mouse();
            keyboard = new Keyboard();
        }catch (AWTException e){
            out.println("Cannot create mouse/keyboard");
            out.println(e.getMessage());
        }
    }


    private void startServer(){
        staticFiles.location("/public");

        get("/type/:words", (req, res) -> {
            keyboard.type(req.params(":words"));
            return true;
        });

        get("/hover/:x/:y", (req, res) -> {
            mouse.move(Integer.parseInt(req.params(":x")), Integer.parseInt(req.params(":y")));
            return true;
        });


        get("/click/:x/:y", (req, res) -> {
            mouse.click(Integer.parseInt(req.params(":x")), Integer.parseInt(req.params(":y")));
            return true;
        });

        get("/rightClick/:x/:y", (req, res) -> {
            mouse.rightClick(Integer.parseInt(req.params(":x")), Integer.parseInt(req.params(":y")));
            return true;
        });

        get("/keypress/:key", (req, res) -> {
            keyboard.press(req.params(":key"));
            return true;
        });

        get("/commands", (req, res) -> {
            try {
                File file = new File("commands.json");
                if(file.createNewFile()){
                    BufferedWriter out = new BufferedWriter(new FileWriter(file));
                    out.write("{}");
                    out.close();
                }
                BufferedReader in = new BufferedReader(new FileReader(file));
                String result = in.readLine();
                in.close();
                return result;
            } catch (IOException e){
                System.err.println(e.getMessage());
            }
            return false;
        });

        get("/save/:cmd", (req, res) -> {
            try {
                File file = new File("commands.json");
                BufferedWriter out = new BufferedWriter(new FileWriter(file));
                out.write(req.params(":cmd"));
                out.close();
                return true;
            } catch (IOException e){
                System.err.println(e.getMessage());
            }
            return false;
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

        out.println("Listening on port: " + PORT);
    }
}
