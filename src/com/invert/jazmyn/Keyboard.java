package com.invert.jazmyn;


import java.awt.*;
import java.awt.event.KeyEvent;

/**
 * Created by Mathew on 5/2/2018.
 */
public class Keyboard {

    private Robot robot;

    public Keyboard() throws AWTException{
        robot = new Robot();
    }

    public void press(String key){
        if(key.equals("enter")){
            System.out.println("Pressing enter");
            pressKey(KeyEvent.VK_ENTER);
        }
        else if(key.equals("tab")){
            pressKey(KeyEvent.VK_TAB);
        }

    }

    public void pressKey(int code){
        robot.keyPress(code);
        robot.keyRelease(code);
    }

    public void type(String words){
        System.out.println("Typing: " + words);
        for(int i=0;i<words.length();i++){
            pressKey(getKeyCode(words.charAt(i)));
        }
    }


    public int getKeyCode(char c){
        return KeyEvent.getExtendedKeyCodeForChar(c);
    }
}
