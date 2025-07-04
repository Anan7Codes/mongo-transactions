import billModel from "./models/bills.js";
import userModel from "./models/user.js";

const userBalance = await userModel.findById('68675ff8ba106593fc368c01', 'balance')

console.log(userBalance, "bal")

const userBills = await billModel.findByIdAndUpdate({
    userId: '68675ff8ba106593fc368c01'
}, {
    status: 'processing'
})

console.log("user bills", userBills)