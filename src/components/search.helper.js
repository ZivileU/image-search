  // Documentation for image url mapping: https://www.flickr.com/services/api/misc.urls.html
  export const mapImageUrls = images => (
    images.map(image => ({
      url: `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}_z.jpg`,
      id: image.id
    }))
  )
