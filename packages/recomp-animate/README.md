# Animate

The animate package provides simple / easy-to-use hooks to create animations.

The goal of this package is to simplify animating components. No special divs or components are needed, this package just uses requestAnimationFrame and easing functions to change numeric values over the time.

### Common use cases

- Having some value animate when a component mounts
  - This can be implemented with setting a default value / state that is different from the one provided to the hook
- Having a value animate between state changes
  - Each transition from one state to another can be defined with a separate duration and easing function
- Having some value animate before a component unmounds
  - Hooks and callbacks can be set to trigger an animation on some close request and call some unmounting callback on animation completion

### In-Transition Changes

- During an animation transition, some event my trigger a component to move to another state or even unmount. In order to have smooth transitions, transitions might need to use one of the below methods:

Restrict in-transition / animating state changes
- Restrict values from moving to another state while in a transition animation

Invertible Easing Function
- The inverse of an easing function can be used to calculate a time offset from the current animated value and "continue" calculations from there
- This will only work if the values from two transitionn states share the same domain

Estimated Current Duration
- Estimate how long it will take for a transition to complete based on the current "in-transition" value and the target value. Then run the new transition from that point to the target in that duration.
- This may result in new possible values that aren't in the domain of any of the transitions