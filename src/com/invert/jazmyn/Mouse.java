package com.invert.jazmyn;

import java.awt.*;
import java.awt.event.InputEvent;

import static java.awt.MouseInfo.getPointerInfo;

public class Mouse {

    private Robot robot;

    public Mouse() throws AWTException{
        robot = new Robot();
    }


    public void moveDelta(int dx, int dy){
        Point p = getPos();
        move(p.x+dx, p.y+dy);
    }

    public void move(int x, int y){
        robot.mouseMove(x, y);
    }

    public void smoothMove(final int x, final int y, final int millis){
        //DOSEN'T WORK RN


        Point p = getPos();
        final int stepX, stepY;

        stepX = (x-p.x) / millis;
        stepY = (x-p.y) / millis;

        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                for(int i=0;i<millis; i++){
                    moveDelta(stepX, stepY);
                    try {
                        Thread.sleep(1);
                    }catch (InterruptedException e){
                        System.err.println("Error when preforming smooth mouse thread");
                        System.err.println(e.getMessage());
                    }
                }
                move(x, y);
            }
        });
        thread.start();
        try{
            thread.join();
        }catch (InterruptedException e){
            System.err.println("Error when closing smooth mouse thread");
            System.err.println(e.getMessage());
        }
    }


    public Point getPos(){
        return getPointerInfo().getLocation();
    }

    public void click(){
        robot.mousePress(InputEvent.BUTTON1_MASK);
        robot.mouseRelease(InputEvent.BUTTON1_MASK);
    }

    public void click(int x, int y){
        move(x, y);
        click();
    }


}
