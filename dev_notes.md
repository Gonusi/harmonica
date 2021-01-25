App must show a visual representation of 10 C diatonic harmonica holes and their respective keys
When a sound is played to the mic, if it is in the range of any harmonica keys, that key is highlighted and inside
a line is shown indicating pitch relative to exact pitch of that key.

For example, if key A4 is at 440hz, and the sound is at 435hz, the line would be slightly below the center of
that key indicating you're "bending" the key a bit.

The keys are clickable and play a generated tone.

## 2021-01-24 goals:

-   Write script to define pitch ranges available for C harmonica (all pitches for all keys are here: https://en.wikipedia.org/wiki/Scientific_pitch_notation)
-   Create a single key C4 that reacts as specified
-   Use TDD

### Review:

-   Did not write script for pitch range conversion, this may be unnecessary.
-   Created a key component, tried to use note A4 for detection. Turns out my harmonica has no such note. Simulated by whistling, it works. Harmonica pitch also detected.
-   Used TDD for Key component, but did use it with the usePitch hook.

---

## 2021-01-25 goals:

1.  determine notes playbable on my C diatonic harmonica, configure them
2.  determine how, in music theory, bounds between notes are defined. Where does C end and D begin? Is it in the middle, between the two frequencies?
3.  create a loop to create Key components for each of the note
4.  make them activate correctly as their pitch is played to the mic

###Review:

Successfully implemented all goals except didn't determine bounds between notes. This is due to unexpected problem. Could not detect any pitch higher than 2kHz. I suspect it's due to sampling rate being lowered for faster processing inside ml5 framework. Turns out max recordable frequency is called Nyquist frequency and it is half of sample rate, implying there's a 4kHz sample rate set somewhere in my audio.

Another problem is I can no longer access my CRA app from my local network. I remember this problem, but don't remember the solution yet.

I'll tackle this tomorrow.

---

## 2021-01-26 goals:

1. Determine if problem with pitches above 2kHz not being recognized at all is due to it being the Nyquist frequency of my sample rate.
2. Determine if I can increase the sample rate.
3. Increase the sample rate and test performance.
4. Test on mobile.

###Review:
Problem lied within ml5 libary. As suspected, for performance reasons, audio is resampled to 1024 kHz before processing for performance reasons.
