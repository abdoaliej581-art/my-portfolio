// دالة تظهر رسالة ترحيبية
function showMessage() {
    alert("أهلاً بيك! أنا عبدالرحمن، يسعدني تواصلك معايا! 😊");
}

function showMessage() {
    alert("أهلاً بيك! أنا عبدالرحمن، يسعدني تواصلك معايا! 😊");
}

function sendMessage() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;
    
    if (name === "" || email === "" || message === "") {
        document.getElementById("response").innerText = "⚠️ من فضلك املأ كل الحقول!";
        document.getElementById("response").style.color = "red";
        return;
    }
    
    document.getElementById("response").innerText = "✅ شكراً يا " + name + "! استلمنا رسالتك وهنرد عليك قريباً.";
    document.getElementById("response").style.color = "green";
    
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
}
