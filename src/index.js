const start = document.getElementById("start");
const stop = document.getElementById("stop");
const video1 = document.getElementById("video1");
const video2 = document.getElementById("video2");
const downloadLink = document.getElementById("download");

let recorder, stream, streamVideo;
let shouldStop = false;
let stopped = false;
let cunks;
// start screen recording
async function startRecording() {
  await startVideo();
  stream = await navigator.mediaDevices.getDisplayMedia({
    video: { mediaSource: "self" },
    controll: false,

    // video: { cursor: "always", displaySurface: "browser" },
    // video: true,
  });

  const options = { mimeType: "video/webm" };
  recorder = new MediaRecorder(stream, options);
  chunks = [];
  // recorder.ondataavailable = (e) => {
  //   chunks.push(e.data);
  // };

  recorder.addEventListener("dataavailable", function (e) {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }

    if (shouldStop === true && stopped === false) {
      mediaRecorder.stop();
      stopped = true;
    }
  });

  recorder.addEventListener("stop", async function () {
    console.log("stop run");
    let b = new Blob(chunks);
    downloadLink.href = URL.createObjectURL(b);
    console.log(downloadLink.href);
    downloadLink.download = "acetest.webm";

    const completeBlob = new Blob(chunks, { type: chunks[0].type });
    console.log(completeBlob);
    console.log(URL.createObjectURL(completeBlob));
    video1.src = URL.createObjectURL(completeBlob);

    // stop webcam video code
    var tracks = streamVideo.getTracks();
    for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      track.stop();
    }

    video2.srcObject = null;
    //end stop webcam video code

    let fi = new File([b], "mohit.webm");
    let formData = new FormData();
    formData.append("recordVideo", fi);

    let params = {
      method: "POSt",
      body: formData,
    };

    let x = await fetch("http://localhost:3000/post", params);
    console.log(await x.json());
  });

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

stop.addEventListener("click", async () => {
  stop.setAttribute("disabled", true);
  start.removeAttribute("disabled");
  shouldStop = true;
  recorder.stop();
  stream.getVideoTracks()[0].stop();
});
