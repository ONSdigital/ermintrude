/**
 * @param {string} collectionID - Unique ID of the collection that is being previewed
 * @param {string} url - URL of the page that the caller wants the JSON data for
 * @returns {Promise} - Which resolves to the page JSON data or rejects with an error
 */

function getPage(collectionID, url) {
    var fetchURL = '/zebedee/data/' + collectionID + '?uri=' + url;
    var fetchOptions = {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    };
    return new Promise((resolve, reject) => {
        fetch(fetchURL, fetchOptions).then(response => {
            if (response.ok) {
                return response.json();
            }
            reject(response);
        }).then(response => {
            resolve(response);
        })
    });
}