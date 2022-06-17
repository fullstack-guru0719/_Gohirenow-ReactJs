import Swal from "sweetalert2";

export default function (e, history, freeuser) {
    console.log(e, history, freeuser)
    if (e.target && e.target.className.includes('free-user-popup')) {
        e.preventDefault();
        Swal.fire({
            html: `<h2>You need to upgrade your current plan to contact candidates!</h2>
								<p style="margin-top: 50px;"></p>`,
            type: "warning",
            width: "950px",
            showCancelButton: true,
            confirmButtonColor: "#ED7B18",
            confirmButtonText: "Upgrade now!"
        }).then((result) => {if (result.value) {history.push("/pricing");}})
    } else if (e.target && e.target.className.includes('unlogged-user-popup')) {
        e.preventDefault();
        Swal.fire({
            html: `<h2>You need to sign in to contact candidates!</h2>
								<p style="margin-top: 50px;"></p>`,
            type: "warning",
            width: "950px",
            showCancelButton: true,
            confirmButtonColor: "#ED7B18",
            confirmButtonText: "Sign in"
        }).then((result) => {if (result.value) {history.push("/register");}})
    } else { if(e.target && e.target.className.includes('portfolio-wrapper')) {
        if (freeuser) {
            e.preventDefault();
            Swal.fire({
                html: `<h2>You need to upgrade your current plan to contact candidates!</h2>
								<p style="margin-top: 50px;"></p>`,
                type: "warning",
                width: "950px",
                showCancelButton: true,
                confirmButtonColor: "#ED7B18",
                confirmButtonText: "Upgrade now!"
            }).then((result) => {if (result.value) {history.push("/pricing");}})
        } else {
            e.preventDefault();
            Swal.fire({
                html: `<h2>You need to sign in to contact candidates!</h2>
								<p style="margin-top: 50px;"></p>`,
                type: "warning",
                width: "950px",
                showCancelButton: true,
                confirmButtonColor: "#ED7B18",
                confirmButtonText: "Sign in"
            }).then((result) => {if (result.value) {history.push("/register");}})
        }
    } else
        return e
    }

}