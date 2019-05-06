let photo = {
  bytes: 1000,
  created_at: "2018-08-11T12:24:32Z",
  etag: "abcdefghijklmnopqrstuvwxyz12345",
  format: "jpg",
  height: 1000,
  public_id: "123",
  resource_type: "image",
  signature: "abcdefghijklmnopqrstuvwxyz12345",
  tags: ["mytravelguide"],
  type: "upload",
  url: "http://res.cloudinary.com/demo/image/upload/v1473596672/eneivicys42bq5f2jpn2.jpg",
  version: 123,
  width: 1000
}

const photoUpload = jest.fn(() => Promise.resolve(photo));

module.exports = {
  photoUpload,
  photo
}
