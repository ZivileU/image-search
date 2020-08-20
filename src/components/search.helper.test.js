import { mapImageUrls } from './search.helper'

test('maps the url', () => {
  const images = [
    {id: "50247953331", owner: "153014321@N05", secret: "9bf14f4947", server: "65535", farm: 66},
    {id: "50247946221", owner: "153014321@N05", secret: "845cd6caa4", server: "65535", farm: 66}
  ]

  expect(mapImageUrls(images)).toEqual(images.map(image => ({
    url: `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}_z.jpg`,
    id: image.id})))
})
