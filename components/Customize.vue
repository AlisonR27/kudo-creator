<template>
  <div class="overflow-hidden">
    <a href="/"><img class="inline" src="https://d29fhpw069ctt2.cloudfront.net/icon/image/39092/preview.png" height="15px" width="15px" alt="">Return</a>
    <div>
      <span class="text-gray-700 text-lg font-bold text-center mb-4 block">Personalize seu kudo card!</span>
      <canvas id="kudo-canvas"></canvas>
      <textarea @change="keyText" @keydown="(e)=> { lastText = e.target.value }" @keyup="keyText" :value="text" name="kudo-text" id="kudo-text" class="no-resize w-0 h-0"></textarea>
      <img id="canvas-bg" :src="currentModel.src" alt="" srcset="" class="absolute opacity-0 invisible left-0 top-0" @load="processCanvas()">
    </div>
    <a class="btn-1 cursor-pointer" @click="saveCanvas">
      Próximo
    </a>
  </div>
</template>
<script>
import html2canvas from "html2canvas"
function downScaleImage(img, scale) {
    var imgCV = document.createElement('canvas');
    imgCV.width = img.width;
    imgCV.height = img.height;
    var imgCtx = imgCV.getContext('2d');
    imgCtx.drawImage(img, 0, 0);
    return downScaleCanvas(imgCV, scale);
}
function downScaleCanvas(cv, scale) {
    if (!(scale < 1) || !(scale > 0)) throw ('scale must be a positive number <1 ');
    var sqScale = scale * scale; // square scale = area of source pixel within target
    var sw = cv.width; // source image width
    var sh = cv.height; // source image height
    var tw = Math.floor(sw * scale); // target image width
    var th = Math.floor(sh * scale); // target image height
    var sx = 0, sy = 0, sIndex = 0; // source x,y, index within source array
    var tx = 0, ty = 0, yIndex = 0, tIndex = 0; // target x,y, x,y index within target array
    var tX = 0, tY = 0; // rounded tx, ty
    var w = 0, nw = 0, wx = 0, nwx = 0, wy = 0, nwy = 0; // weight / next weight x / y
    // weight is weight of current source point within target.
    // next weight is weight of current source point within next target's point.
    var crossX = false; // does scaled px cross its current px right border ?
    var crossY = false; // does scaled px cross its current px bottom border ?
    var sBuffer = cv.getContext('2d').
    getImageData(0, 0, sw, sh).data; // source buffer 8 bit rgba
    var tBuffer = new Float32Array(3 * tw * th); // target buffer Float32 rgb
    var sR = 0, sG = 0,  sB = 0; // source's current point r,g,b
    /* untested !
    var sA = 0;  //source alpha  */    

    for (sy = 0; sy < sh; sy++) {
        ty = sy * scale; // y src position within target
        tY = 0 | ty;     // rounded : target pixel's y
        yIndex = 3 * tY * tw;  // line index within target array
        crossY = (tY != (0 | ty + scale)); 
        if (crossY) { // if pixel is crossing botton target pixel
            wy = (tY + 1 - ty); // weight of point within target pixel
            nwy = (ty + scale - tY - 1); // ... within y+1 target pixel
        }
        for (sx = 0; sx < sw; sx++, sIndex += 4) {
            tx = sx * scale; // x src position within target
            tX = 0 |  tx;    // rounded : target pixel's x
            tIndex = yIndex + tX * 3; // target pixel index within target array
            crossX = (tX != (0 | tx + scale));
            if (crossX) { // if pixel is crossing target pixel's right
                wx = (tX + 1 - tx); // weight of point within target pixel
                nwx = (tx + scale - tX - 1); // ... within x+1 target pixel
            }
            sR = sBuffer[sIndex    ];   // retrieving r,g,b for curr src px.
            sG = sBuffer[sIndex + 1];
            sB = sBuffer[sIndex + 2];

            /* !! untested : handling alpha !!
               sA = sBuffer[sIndex + 3];
               if (!sA) continue;
               if (sA != 0xFF) {
                   sR = (sR * sA) >> 8;  // or use /256 instead ??
                   sG = (sG * sA) >> 8;
                   sB = (sB * sA) >> 8;
               }
            */
            if (!crossX && !crossY) { // pixel does not cross
                // just add components weighted by squared scale.
                tBuffer[tIndex    ] += sR * sqScale;
                tBuffer[tIndex + 1] += sG * sqScale;
                tBuffer[tIndex + 2] += sB * sqScale;
            } else if (crossX && !crossY) { // cross on X only
                w = wx * scale;
                // add weighted component for current px
                tBuffer[tIndex    ] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // add weighted component for next (tX+1) px                
                nw = nwx * scale
                tBuffer[tIndex + 3] += sR * nw;
                tBuffer[tIndex + 4] += sG * nw;
                tBuffer[tIndex + 5] += sB * nw;
            } else if (crossY && !crossX) { // cross on Y only
                w = wy * scale;
                // add weighted component for current px
                tBuffer[tIndex    ] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // add weighted component for next (tY+1) px                
                nw = nwy * scale
                tBuffer[tIndex + 3 * tw    ] += sR * nw;
                tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                tBuffer[tIndex + 3 * tw + 2] += sB * nw;
            } else { // crosses both x and y : four target points involved
                // add weighted component for current px
                w = wx * wy;
                tBuffer[tIndex    ] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // for tX + 1; tY px
                nw = nwx * wy;
                tBuffer[tIndex + 3] += sR * nw;
                tBuffer[tIndex + 4] += sG * nw;
                tBuffer[tIndex + 5] += sB * nw;
                // for tX ; tY + 1 px
                nw = wx * nwy;
                tBuffer[tIndex + 3 * tw    ] += sR * nw;
                tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                tBuffer[tIndex + 3 * tw + 2] += sB * nw;
                // for tX + 1 ; tY +1 px
                nw = nwx * nwy;
                tBuffer[tIndex + 3 * tw + 3] += sR * nw;
                tBuffer[tIndex + 3 * tw + 4] += sG * nw;
                tBuffer[tIndex + 3 * tw + 5] += sB * nw;
            }
        } // end for sx 
    } // end for sy

    // create result canvas
    var resCV = document.createElement('canvas');
    resCV.width = tw;
    resCV.height = th;
    var resCtx = resCV.getContext('2d');
    var imgRes = resCtx.getImageData(0, 0, tw, th);
    var tByteBuffer = imgRes.data;
    // convert float32 array into a UInt8Clamped Array
    var pxIndex = 0; //  
    for (sIndex = 0, tIndex = 0; pxIndex < tw * th; sIndex += 3, tIndex += 4, pxIndex++) {
        tByteBuffer[tIndex] = Math.ceil(tBuffer[sIndex]);
        tByteBuffer[tIndex + 1] = Math.ceil(tBuffer[sIndex + 1]);
        tByteBuffer[tIndex + 2] = Math.ceil(tBuffer[sIndex + 2]);
        tByteBuffer[tIndex + 3] = 255;
    }
    // writing result to canvas.
    resCtx.putImageData(imgRes, 0, 0);
    return resCV;
}
function clearLines(context) {
  context.fillStyle = "#fff"
  context.fillRect(248,100, 400, 20)
  context.fillRect(248,140, 400, 20)
  context.fillRect(248,180, 400, 20)
  context.fillRect(248,220, 400, 20)
  context.fillRect(248,260, 400, 20)
}
function writeText(text,last,x,y) {
  const canvas = document.querySelector('canvas')
  const context = canvas.getContext('2d');
  var lines = text.split('\n');
  clearLines(context);
  for (const [index,value] of lines.entries()) {
    context.font = '16px poppins'
 
    context.fillStyle = "#151515"
    context.fillText(value,x,  y+40*index)
  }
}
export default {
  data(){ 
    return {
      text: '',
      lastText: '',
    }
  },
  mounted() {
    
  },
  computed: {
   currentModel: function() {
     return this.$store.getters['models/currentModel']
   }
  },
  methods: {
    saveCanvas: function(e) {
      const canvas = document.querySelector('canvas')
      var image = canvas.toDataURL("image/png") 
      window.localStorage.setItem('kudoOutput', image)
      this.$router.push('/output')
    },
    keyText: function(e) {
      writeText(e.target.value,this.lastText,250,115)
    },
    processCanvas: () => {
      const canvas = document.querySelector('canvas')
      const canvasParent = canvas.parentElement
      canvasParent.removeChild(canvas)
      const newCanvas =  downScaleImage(document.querySelector('#canvas-bg'),0.5)
      newCanvas.classList.add('mx-auto')
      newCanvas.classList.add('cursor-text')
      newCanvas.onclick = () => {
        document.querySelector('#kudo-text').focus();
      }
      canvasParent.append(newCanvas)
    },
    nextStep: () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      html2canvas(document.querySelector(".kudo-card")).then(canvas => {
        document.body.appendChild(canvas)
      });
    }
  },
      
  updated() {
    const canvas = document.querySelector('canvas')
    var image = canvas.toDataURL("image/png")
    window.localStorage.setItem('kudoOutput', image)
  }
}
</script>