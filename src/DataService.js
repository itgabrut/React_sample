const DataService = {


    url: 'http://localhost:8080/employee',

    getAll: function () {
        return fetch(this.url + '/get');
    },

    addUser: function (user) {
        return fetch(this.url + '/add', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(checkError);
    },

    modifyUser : function (user) {
        return fetch(this.url + '/change',{
            method : 'POST',
            body: JSON.stringify(user),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(checkError);
    },

    deleteAll(){
        window.location.href = this.url + '/removeAll'
      // fetch(this.url + '/removeAll',{
      //     method: 'Post'
      // })
    }

};

function checkError(response) {
    if (response.status >= 200 && response.status <= 299) {
        return response.json();
    } else {
        throw Error(response.statusText);
    }
}

export default DataService;