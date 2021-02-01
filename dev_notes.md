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

### Review:

Problem lied within ml5 libary. However it had nothing to do with Nyquist frequency or sampling. Its' just that the CREPE model only supports up to 1975Hz as stated in the paper, or 1997Hz as seen in the JS implementation (don't know why the diff).

This means I can't use the model for now without retraining it (don't have the know how at this point). I'll have to resort to other means. Perhaps it's for the better.

I've seen good results with "simple" autocorrelation algorithms. I'll implement one tomorrow.

## 2021-01-29 goals:

1. Refactor app to use some popular autocorrelatiomn algorithm.
2. This will need serious juice, consider trying webassembly. This would be a great intro for me. Investigate.

### Review

I tried multiple two implementations of YIN algorithm and one of SWIPE. None performed as well as the CREPE machine learning model. Basically the acurracy was ±5HZ at best and ±40HZ at worst. Could not really tell why there was the difference. I'm sure if I worked on the models and tweaked them I could have gotten better results.

The YIN were also pretty slow. I had a sense that would improve dramatically if I rewrote it to be used in webassembly. Also, there was an unfinished JS implementation using FFT (look it up) that should have improved speed dramatically.

Yet during this time I thought of a simple way to use CREPE model despite it's max 1975Hz pitch limitation. I would simply modify my signal so that the pitch would be 2 times lower. Then after CREPE detects for ex. 220Hz, I would just multiply by 2 and get the correct pitch (for ex.440)

This works surpisingly well, although I'm looking at how to best implement it. At the moment, I just supply 32kHz audio to the model which expects 16kHz, and the result is exactly that - values are twice "lower", but still super accurate.

There is some problem with it lagging after tab switch or some amount of time - need to look into it.

Determined typical harmonicas range:

-   Lowest harmonica G (lowest key) note - G3 / 195.998Hz
-   Hightest harmonica F# (hightest key) note - F7# / 2959.955Hz

## 2021-02-01 goals:

1. Finalise simple implementation using the new insights about CREPE model for C harmonica.

-   Automatically determine which note is closest to pitch (currently "note range" is note pitch +- 20HZ but it overlaps for some notes etc)

2. Look into detecting chords.

### Review:

I'm not 100% about some tensorflow stuff, but I think I managed to stop the slow growth of unresponsiveness in the PitchDetection class. I think it was just due to the fact more audio events were sent to processing than the model was able to, and there was no protection against that, which is super weird, but seems to be correct? I'll need to refactor after more extensive testing.

I also worked on removing traces of YIN and other models, then tried calculating the diff from exact pitch of active note as percentage but the logic is still flawed there. The problem is, if note is:

-   261Hz exact
-   Prev note is 220Hz so theres 41Hz range between them
-   Next note is 279Hz so there's 18Hz range between them

How I calculate it now, if picth is exacly 261, the note is active, but it is not in the middle of it's possible range (50%), more like at 80%, because there's so much more range on the low end. Possibly I'll need two ranges scale here calculated separately. Following prev example:

-   if below exact pitch, 20.5Hz range belongs to curr note, we'll map it to 0-49%
-   if above exact pitch, 9Hz range belongs to curr note, we'll map it to 51-100%
-   50% is reserved for exact pitch

The goal "Look into chords" was way too much, I'll have to repeat todays goals in tomorrows plan.

## 2021-02-02 goals:

1. Devise a useful way to show to user how far is he from the exact pitch of active note
2. Implement it in Key component
