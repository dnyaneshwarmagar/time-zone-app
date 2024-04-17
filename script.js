const x = document.getElementById("demo");
let API_key = "ea5141d879744c10bf750ca1d0933453";

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

getLocation()

async function showPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let info_div = document.getElementById("user_zone_info_div");
    try {
        let response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${API_key}`);
        let data = await response.json();
        // console.log('data:', data.results)
        let info_obj = data.results[0]
        // console.log('info_obj:', info_obj)
        info_div.innerHTML = `
            <p>Name Of Time Zone: ${info_obj.timezone.name}</p>
            <p style="display: flex;justify-content: space-between;"><span style="width: 44%;">Lat: ${info_obj.lat}</span> <span style="width: 44%;">Long: ${info_obj.lon}</span></p>
            <p>Offset STD: ${info_obj.timezone.offset_STD}</p>
            <p>Offset STD Seconds: ${info_obj.timezone.offset_STD_seconds}</p>
            <p>Offset DST: ${info_obj.timezone.offset_DST}</p>
            <p>Offset DST Seconds: ${info_obj.timezone.offset_DST_seconds}</p>
            <p>Country: ${info_obj.country}</p>
            <p>Postcode: ${info_obj.postcode}</p>
            <p>City: ${info_obj.city}</p>
            `
    }
    catch (error) {
        console.log(error);
        info_div.innerHTML = `${error}`
    }
}

document.getElementById("input_form").addEventListener("submit",getZoneByAddress);

async function getZoneByAddress(e){
    e.preventDefault()
    let address = document.getElementById("address_input").value;
    // console.log('address:', address);

    if(!address){
        let dataDiv = document.getElementById("address_zone_div");
        dataDiv.innerHTML = `<p class="error_class">Please enter an address!</p>`;
        return;
    }
    let encodedAddress = encodeURIComponent(address);    

    try{
        let response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodedAddress}&format=json&apiKey=${API_key}
        `);
        let data = await response.json(); 
        
        renderDataForAddress(data)
        // console.log('data:', data);
    }
    catch(error){
        console.log(error);
        let dataDiv = document.getElementById("address_zone_div");
        dataDiv.innerHTML = `<p class="error_class">${error}</p>`;
    };
    
}

function renderDataForAddress(data){
    let mainDiv =  document.getElementById("address_zone_div");
    let dataDiv = document.createElement("div");;
    dataDiv.innerHTML = "";
    // console.log('data:', data)
    if(!data.results[0]){
        mainDiv.innerHTML = `<p class="error_class">Please enter an address!</p>`;
        return;
    }
    let info_obj = data.results[0]
    // console.log('info_obj:', info_obj)
    
    dataDiv.innerHTML = `    
    <p>Name Of Time Zone: ${info_obj.timezone.name}</p>
    <p style="display: flex;justify-content: space-between;"><span style="width: 44%;">Lat: ${info_obj.lat}</span> <span style="width: 44%;">Long: ${info_obj.lon}</span></p>
    <p>Offset STD: ${info_obj.timezone.offset_STD}</p>
    <p>Offset STD Seconds: ${info_obj.timezone.offset_STD_seconds}</p>
    <p>Offset DST: ${info_obj.timezone.offset_DST}</p>
    <p>Offset DST Seconds: ${info_obj.timezone.offset_DST_seconds}</p>
    <p>Country: ${info_obj.country?info_obj.country:"Not Available"}</p>
    <p>Postcode: ${info_obj.postcode?info_obj.postcode:"Not Available"}</p>
    <p>City: ${info_obj.city}</p>
    `

    dataDiv.setAttribute("id","address_zone_info_div");

   
   mainDiv.innerHTML = `<p class="font_hundred">Your Result</p>`
   mainDiv.append(dataDiv)
}