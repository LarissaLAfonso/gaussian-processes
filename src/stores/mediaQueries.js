import { browser } from "$app/environment";
import { readable } from "svelte/store";

const queries = {
  "20rem": "(min-width: 20rem)",
  "30rem": "(min-width: 30rem)",
  "40rem": "(min-width: 40rem)",
  "50rem": "(min-width: 50rem)",
  "60rem": "(min-width: 60rem)",
  "70rem": "(min-width: 70rem)",
  "80rem": "(min-width: 80rem)",
  reducedMotion: "(prefers-reduced-motion: reduce)"
};

function calculateMedia(mqls) {
    /*
    This function calculates the media queries and returns an object with the results.
    - classNames: a string containing the names of the media queries that match the current viewport size
    - <media-query-name>: a boolean indicating whether the media query matches the current viewport size
    */ 
  const media = { classNames: "" };
  const mediaClasses = [];
  for (let name in mqls) {
    media[name] = mqls[name].matches;
    if (media[name]) mediaClasses.push(`mq-${name}`);
  }
  media.classNames = mediaClasses.join(" ");
  return media;
}

export default readable({}, (set) => {
    /*
    Svelte store that tracks the media queries and returns an object with the results
    - set: a function that sets the value of the store
    - mqls: an object that stores the media query listeners
    - onChange: a function that is called when a media query changes
    - calculateMedia: a function that calculates the media queries and returns an object with the results
    - browser: a boolean indicating whether the browser is available
    - queries: an object that stores the media queries
    */
  if (!browser) return;
  const mqls = {};
  const onChange = () => set(calculateMedia(mqls));

  if (browser) {
    for (let q in queries) {
      mqls[q] = window.matchMedia(queries[q]);
      mqls[q].addListener(onChange);
    }

    onChange();
  }

  return () => {
    for (let q in mqls) {
      mqls[q].removeListener(onChange);
    }
  };
});