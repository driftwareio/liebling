import $ from 'https://cdn.jsdelivr.net/npm/jquery@4.0.0/+esm'
import fitvids from 'https://cdn.jsdelivr.net/npm/fitvids@2.1.1/+esm'
import mediumZoom from 'https://cdn.jsdelivr.net/npm/medium-zoom@1.1.2/+esm'
import {
  adjustImageGallery,
  managePostImages,
  makeImagesZoomable
} from './helpers'

$(() => {
  fitvids('.js-post-content')

  adjustImageGallery()
  managePostImages($)
  makeImagesZoomable($, mediumZoom)
})
