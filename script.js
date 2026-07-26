// دالة تظهر رسالة ترحيبية لما تدوس على زرار "تواصل معايا"
function showMessage() {
    alert("أهلاً بيك! أنا عبدالرحمن، يسعدني تواصلك معايا! 😊");
}

// دالة بتبعت الرسالة من نموذج التواصل
function sendMessage() {
    // نجيب القيم من الحقول
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;
    
    // نتأكد إن كل الحقول ممتلئة
    if (name === "" || email === "" || message === "") {
        document.getElementById("response").innerText = "⚠️ من فضلك املأ كل الحقول!";
        document.getElementById("response").style.color = "red";
        return;
    }
    
    // نظهر رسالة نجاح
    document.getElementById("response").innerText = "✅ شكراً يا " + name + "! استلمنا رسالتك وهنرد عليك قريباً.";
    document.getElementById("response").style.color = "green";
    
    // نفرّغ الحقول
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
}
