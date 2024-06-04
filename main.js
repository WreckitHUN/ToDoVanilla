function dataHandler(){
    const _key = "todo";

    function addToLocalStorage(data) {
        if (typeof data != "string") {data = JSON.stringify(data);}
        localStorage.setItem(_key, data);
      }
    
    function getFromLocalStorage() {
        const currentData = JSON.parse(localStorage.getItem(_key));
        return currentData; 
      }
    
    function clearLocalStorage() {
        localStorage.removeItem(_key);
    }

    return{
        addToLocalStorage,
        getFromLocalStorage,
        clearLocalStorage
    };
}

function localStorageUpdater(){
    const _dataHandler = dataHandler();
    let _id;

    // Get the latest _id from the storage
    const currentDataArray = getData();
    if (currentDataArray === null || currentDataArray.length === 0){
        _id = 0;
    } else _id = currentDataArray[currentDataArray.length - 1].id;

  
    function addData(title, description, priority, date) {
        // Create the data obj
        const data = createToDo(title, description, priority, date);
        // Get the dataArray from local storage
        let dataArray = getData();
        dataArray = dataArray === null ? [] : dataArray;
        // Check if data already exist
        const exists = dataArray.some((todo) => todo.id === data.id);
        if (exists) return;
        // Update the local storage
        dataArray.push(data);
        updateLocalStorage(dataArray);
    }
    
    function removeData(id){
        // Get the dataArray from local storage
        let dataArray = getData();
        if (dataArray === null) return;
        console.log(dataArray);
        // Filter the data array
        const filteredData = dataArray.filter((todo) => todo.id !== id);
        // Update the local storage
        updateLocalStorage(filteredData);
    }


    // Return the sorted data by the dates
    function sortData(){
        const dataArray = getData();
        return dataArray.sort((a, b) => a.date - b.date);
    }

    function createToDo(title, description, priority, date){
        _id++;
        return {
            id: _id,
            title,
            description,
            priority,
            date,
        };
    }

    function getData(){
        return _dataHandler.getFromLocalStorage();
    }

    function updateLocalStorage(dataArray) {
        // Clear the local storage
        _dataHandler.clearLocalStorage();
        // Add the data to localStorage
        _dataHandler.addToLocalStorage(dataArray);
    }


    return {
        // Add data (title, description, priority, date)
        addData,
        // Remove a data by id
        removeData,
        // Return the raw data
        getData,
        // Return a the sorted data by date
        sortData,
    };

}

function screenUpdater(){
    const _storageUpdater = localStorageUpdater();
    



    // Functions for date Picker
    const date = document.querySelector("#date");
    date.addEventListener("click", () => {
        let number = Number(date.value.split('-').join(''));
        console.log(number);
    })
    // Functions for TODAY 
    const today = new Date();
    function convertToday(date){
        return date.getFullYear().toString() + addLeadingZero(date.getMonth() + 1) + addLeadingZero(date.getDate());
    }

    function addLeadingZero(number) {
        if (number < 10) {
            return '0' + number;
        } else {
            return number.toString();
        }
    }
    
}

screenUpdater();



