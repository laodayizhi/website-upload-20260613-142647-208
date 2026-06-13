(function () {
    window.setupMoviePlayer = function (video, cover, trigger, streamUrl) {
        if (!video || !cover || !streamUrl) {
            return;
        }

        let attached = false;
        let hlsInstance = null;
        let wantsPlay = false;

        function requestPlay() {
            const promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }

        function attachSource() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                if (wantsPlay) {
                    requestPlay();
                }
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    if (wantsPlay) {
                        requestPlay();
                    }
                });
                return;
            }
            video.src = streamUrl;
            if (wantsPlay) {
                requestPlay();
            }
        }

        function start() {
            wantsPlay = true;
            cover.classList.add("is-hidden");
            video.controls = true;
            attachSource();
            if (!hlsInstance) {
                requestPlay();
            }
        }

        cover.addEventListener("click", start);
        if (trigger && trigger !== cover) {
            trigger.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (!attached) {
                start();
            }
        });
        video.addEventListener("play", function () {
            cover.classList.add("is-hidden");
        });
    };
})();
