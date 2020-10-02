const start = document.getElementById("start");
const stop = document.getElementById("stop");
const video1 = document.getElementById("video1");
const video2 = document.getElementById("video2");

let recorder, stream, streamVideo;

// start screen recording
async function startRecording() {
  await startVideo();
  stream = await navigator.mediaDevices.getDisplayMedia({
    video: { mediaSource: "screen" },
    // video: true,
  });
  recorder = new MediaRecorder(stream);

  const chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.onstop = (e) => {
    // create video
    console.log(chunks);
    const completeBlob = new Blob(chunks, { type: chunks[0].type });
    console.log(URL.createObjectURL(completeBlob));
    video1.src = URL.createObjectURL(completeBlob);
    // end of create video

    // stop webcam video code
    var tracks = streamVideo.getTracks();
    for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      track.stop();
    }

    video2.srcObject = null;
    //end stop webcam video code
  };

  recorder.start();
}

// start webcam video
async function startVideo() {
  streamVideo = await navigator.mediaDevices.getUserMedia({
    // video: { mediaSource: "screen" },
    video: true,
  });
  video2.srcObject = streamVideo;
}

start.addEventListener("click", () => {
  start.setAttribute("disabled", true);
  stop.removeAttribute("disabled");

  startRecording();
});

stop.addEventListener("click", () => {
  stop.setAttribute("disabled", true);
  start.removeAttribute("disabled");

  recorder.stop();
  stream.getVideoTracks()[0].stop();
});
