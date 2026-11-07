# Local portrait segmentation assets

- Runtime: `@mediapipe/tasks-vision` **1.2.2**, downloaded from the npm package
  through jsDelivr. The runtime is Apache-2.0 licensed; see `LICENSE`.
- Model: Google's `selfie_segmenter`, float16, **version 1**.
  Source: https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/1/selfie_segmenter.tflite
- Documentation: https://developers.google.com/edge/mediapipe/solutions/vision/image_segmenter

These files are served by the portfolio itself and loaded only after someone
chooses “Remove photo background”. No photo pixels or masks leave the device.
The binary model segments a person and background; it is not a general object
cutout model. Fine hair, occlusion and complex backgrounds can affect quality.
