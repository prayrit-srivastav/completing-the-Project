require('text-encoding').TextEncoder;
import "@testing-library/jest-dom/extend-expect";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import { fireEvent } from "@testing-library/dom";
// import { render, fireEvent } from '@testing-library/dom';

const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

let dom;
let document;
let window;
let postForm;
let postInput;
let imageInput;
let submitButton;
let r;
beforeEach(() => {
  dom = new JSDOM(html, { runScripts: 'dangerously' });
  document = dom.window.document;
  window = dom.window;
  r = window.r;

  // Set global variables
  global.window = window;
  global.document = document;

  // Get form elements
  postForm = document.getElementById('postForm');
  postInput = document.getElementById('postInput');
  imageInput = document.getElementById('imageInput');
  submitButton = document.querySelector('.submit-button');
});

// Function to trigger form submission
const submitForm = () => {
  const submitEvent = document.createEvent('Event');
  submitEvent.initEvent('submit', true, true);
  postForm.dispatchEvent(submitEvent);
};

test('Form submission adds a new post to the Posts div', () => {
  // Set values for the form inputs
  let submitForm = document.querySelector('.submit-button');
  postInput.value = 'New Post';

  // Create a File object
  const fileContent = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...'; // Contents of the file (base64-encoded image data)
  const fileName = 'image.jpg';
  const file = new File([fileContent], fileName, { type: 'image/jpeg' });
  
  // Create a FileList object and assign it to the input element
  const fileList = {
    0: file,
    length: 1,
    item: function (index) {
      return file;
    },
  };
  Object.defineProperty(imageInput, 'files', {
    value: fileList,
  });
  // document.getElementById('postForm')
  // Trigger the form submission
  // postForm.submit();
  fireEvent.submit(postForm)
  let postsData = r();
  console.log(postsData);
  // Assert the new post has been added to the Posts div
  const postsContainer = document.getElementById('posts');
  const postElements = postsContainer.getElementsByClassName('post');
  expect(postElements.length).toBe(5);
  expect(postElements[4].querySelector('h3')).toHaveTextContent('You');
  expect(postElements[4].querySelector('p')).toHaveTextContent('New Post');
  // expect(postElements[4].querySelector('img')).toHaveAttribute('src', expect.stringContaining('image.jpg'));
});