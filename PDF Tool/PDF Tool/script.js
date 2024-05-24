var pdf = new PDFAnnotate('pdf-container', 'G:\PDF Tool\PDF Tool\dist\with_signature.pdf', {
  onPageUpdated(page, oldData, newData) {
    console.log(page, oldData, newData);
  },
  ready() {
    console.log('Plugin initialized successfully');
    pdf.loadFromJSON(sampleOutput);
  },
  scale: 1.5,
  pageImageCompression: 'MEDIUM', // FAST, MEDIUM, SLOW(Helps to control the new PDF file size)
});

function changeActiveTool(event) {
  var element = $(event.target).hasClass('tool-button')
    ? $(event.target)
    : $(event.target).parents('.tool-button').first();
  $('.tool-button.active').removeClass('active');
  $(element).addClass('active');
}

function enableSelector(event) {
  event.preventDefault();
  changeActiveTool(event);
  pdf.enableSelector();
}

function enablePencil(event) {
  event.preventDefault();
  changeActiveTool(event);
  pdf.enablePencil();
}

function enableAddText(event) {
  event.preventDefault();
  changeActiveTool(event);
  pdf.enableAddText();
}

function enableAddSignature(event) {
  event.preventDefault();
  changeActiveTool(event)
  pdf.addSignature();
}

function enableAddArrow(event) {
  event.preventDefault();
  changeActiveTool(event);
  pdf.enableAddArrow(function () {
    $('.tool-button').first().find('i').click();
  });
}

function addImage(event) {
  event.preventDefault();
  pdf.addImageToCanvas();
}

function enableRectangle(event) {
  event.preventDefault();
  changeActiveTool(event);
  pdf.setColor('rgba(255, 0, 0, 0.3)');
  pdf.setBorderColor('blue');
  pdf.enableRectangle();
}

function deleteSelectedObject(event) {
  event.preventDefault();
  pdf.deleteSelectedObject();
}

function draw(e) {
  if (!isDrawing) return;
  context.beginPath();
  context.moveTo(lastX, lastY);
  context.lineTo(e.offsetX, e.offsetY);
  context.strokeStyle = penColor;
  context.lineWidth = 2;
  context.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function savePDF() {
  // pdf.savePdf();
  pdf.savePdf('output.pdf'); // save with given file name
}

async function loadPDF() {
  const url = 'G:\PDF Tool\PDF Tool\dist\with_signature.pdf'
  const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
  pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
  renderPage();
}

async function renderPage(pageNumber, scale) {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1.3 });
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  debugger;
  const renderContext = {
      canvasContext: pdfCtx,
      viewport: viewport,
  };
  debugger;
  await page.render(renderContext).promise;

  textOverlay.innerHTML = '';
  if (annotations[pageNumber]) {
      for (const annotation of annotations[pageNumber]) {
          if (annotation.type === 'text') {
              const textInput = createAnnotationElement(annotation.left, annotation.top, annotation.text);
              textOverlay.appendChild(textInput);
              textall.push(textInput);
          }
      }
  }
}

pdfjsLib.getDocument(url).promise.then(function (pdf) {
  pdfDoc = pdf;
  renderPage(currentPage, 1.5);
});

function clearPage() {
  pdf.clearActivePage();
}

    loadPDF();


$(function () {
  $('.color-tool').click(function () {
    $('.color-tool.active').removeClass('active');
    $(this).addClass('active');
    color = $(this).get(0).style.backgroundColor;
    pdf.setColor(color);
  });

  $('#brush-size').change(function () {
    var width = $(this).val();
    pdf.setBrushSize(width);
  });

  $('#font-size').change(function () {
    var font_size = $(this).val();
    pdf.setFontSize(font_size);
  });
});
