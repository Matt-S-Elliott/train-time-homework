var config = {
    apiKey: "AIzaSyDlFMpPTHMd-cOXKEUFZuu5GbB4G7tuzmo",
    authDomain: "train-times-homework-cbc.firebaseapp.com",
    databaseURL: "https://train-times-homework-cbc.firebaseio.com",
    projectId: "train-times-homework-cbc",
    storageBucket: "",
    messagingSenderId: "232612117818"
};
firebase.initializeApp(config);
var database = firebase.database();



$("#new-train-submit").click(function (event) {
    event.preventDefault();
    database.ref().push({
        trainName: $("#train-name-input").val(),
        destination: $("#destination-input").val(),
        firstTrainTime: $("#first-train-time-input").val(),
        frequency: $("#frequency-input").val(),
    })

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");
})

database.ref().on("child_added", function (snapshot) {
    var newTrain = $("<tr>");
    newTrain.append("<td>" + snapshot.val().trainName);
    newTrain.append("<td>" + snapshot.val().destination);
    newTrain.append("<td>" + snapshot.val().frequency);
    newTrain.append("<td>" + moment(snapshot.val().firstTrainTime, "HH:mm").format("HH:mm"));
    var firstTrainTime = moment(snapshot.val().firstTrainTime, "HH:mm");
    var timeDiff = moment().diff(firstTrainTime, "minutes");
    var remainder = timeDiff % snapshot.val().frequency;
    var minutesUntilTrain = snapshot.val().frequency - remainder;
    var nextTrainArrival = moment().add(minutesUntilTrain, "minutes");

    if (timeDiff < 0) {
        minutesUntilTrain = Math.abs(timeDiff);
        nextTrainArrival = firstTrainTime;
    }

    newTrain.append("<td>" + nextTrainArrival.format("HH:mm"));
    newTrain.append("<td>" + minutesUntilTrain);
    $("#trains-go-here").append(newTrain);
})