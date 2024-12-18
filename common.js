function navigateHome() {
    window.location.href = "index.html";
}

$(document).ready(function() {
    $('#home-button').on('click', navigateHome);
});
