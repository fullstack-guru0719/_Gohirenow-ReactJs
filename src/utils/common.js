const imageExtensions = ["jpeg", "jpg", "png", "gif"];

const otherExtensions = [
	"ppt",
	"pptx",
	"doc",
	"docx",
	"pdf",
	"xls",
	"xlsx",
	"csv",
	"txt"
];

export const getDataURL = (file) => {
	return new Promise((resolve, reject) => {
		let ext = file.name
			.toLowerCase()
			.split(".")
			.pop();
		let img = imageExtensions.indexOf(ext);
		let other = otherExtensions.indexOf(ext);
		if (img > -1 || other > -1) {
			if (img > -1) {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = (error) => reject(error);
			} else {
				return resolve(ext);
			}
		} else {
			return resolve("error");
		}
	});
};

export const getExtensionByFile = (file) => {
	let ext = file.name.split(".").pop();
	return ext;
};

export const getExtensionByName = (name) => {
	let ext = name.split(".").pop();
	return ext;
};

export const isImage = (ext) => {
	let dataUrl = ext.indexOf("data:image/");
	let other = imageExtensions.indexOf(ext.toLowerCase());
	if (other > -1 || dataUrl > -1) return true;
	return false;
};

export const isValidFileByFile = (file) => {
	let ext = file.name.split(".").pop();
	let img = imageExtensions.indexOf(ext);
	let other = otherExtensions.indexOf(ext);
	if (img > -1 || other > -1) {
		return true;
	}
	return false;
};

export const isValidFileByName = (name) => {
	let ext = name.split(".").pop();
	let img = imageExtensions.indexOf(ext);
	let other = otherExtensions.indexOf(ext);
	if (img > -1 || other > -1) {
		return true;
	}
	return false;
};

export const localdate = (date) => {

	if(isEqual(new Date(date),new Date(currentDateTime()))){

		return currentDateTime()
	}
	else{
        let newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        return newDate.toLocaleString();
	}
};
export const  isEqual=(startDate, endDate)=> {
    return (
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate()&&
        startDate.getHours() === endDate.getHours()&&
        startDate.getMinutes() === endDate.getMinutes()
    );
}

export const randomString = () => {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var randomstring = "";
	for (var i = 0; i < 100; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum + 1);
	}
	return randomstring;
};

export const currentDateTime = () => {
	var today = new Date();
	var date =
		today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();
	var time =
		today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date + " " + time;
	return dateTime;
	// var date = new Date();
	// let newDate = new Date(date.getTime() * 60 * 1000);
	// return newDate;
};
