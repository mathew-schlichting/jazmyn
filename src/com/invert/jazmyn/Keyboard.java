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

    public void type(String words){
        System.out.println("Typing: " + words);
        for(int i=0;i<words.length();i++){
            robot.keyPress(getKeyCode(words.charAt(i)));
            robot.keyRelease(getKeyCode(words.charAt(i)));
        }
    }


    public int getKeyCode(char c){
        return KeyEvent.getExtendedKeyCodeForChar(c);
    }
}
