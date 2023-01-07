const arrayToObject = (arrays, unitName) => {
    // let unitObj = {};
    if (unitName === "temperature"){
        arrays.forEach(array => {
            array.forEach(element => {
                let dateTime = new Date(element[0]);
                let year = dateTime.getFullYear();
                let month = dateTime.getMonth();
                let day = dateTime.getDate();
                let hours = dateTime.getHours();
                let minute = dateTime.getMinutes();
                let formatedTime = `${year}-${month+1}-${day}:${hours}:${minute}`;
                element[0] = formatedTime;
                // console.log(formatedTime);
            })
            // unitObj = array.map(([time, temperature]) => ({time, temperature}));
        });

        return arrays.flat();
    }
    else if (unitName === "humidity"){
        arrays.forEach(array => {
            array.forEach(element => {
                let dateTime = new Date(element[0]);
                let year = dateTime.getFullYear();
                let month = dateTime.getMonth();
                let day = dateTime.getDate();
                let hours = dateTime.getHours();
                let minute = dateTime.getMinutes();
                let formatedTime = `${year}-${month+1}-${day}:${hours}:${minute}`;
                element[0] = formatedTime;
                // console.log(formatedTime);
            })
            // unitObj = array.map(([time, humidity]) => ({time, humidity}));
        });

        return arrays.flat();
    }
}

module.exports = {
    arrayToObject
}