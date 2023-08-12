//in backend or node js we imporre usin require
//but in front end we generally save the import

import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constant.js"
const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("FundButton")
const balanceButton = document.getElementById("Getbalance")
const withdrawbutton = document.getElementById("withdraw")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawbutton.onclick = withdraw
console.log(ethers)
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        document.getElementById("connectButton").innerHTML = "Connected!"
    } else {
        document.getElementById("connectButton").innerHTML = "Please install metamask:)!"
    }
}
async function fund() {
    //instead of any fix amount we will make sure user will input the value of the eth amount
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}.....`)
    if (typeof window.ethereum !== "undefined") {
        //provider/connection to blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum) //automatically takes provider from meta mask
        const signer = provider.getSigner() //get wallet ehichever is connected to provider
        const contract = new ethers.Contract(contractAddress, abi, signer) //we will connect to the local net created by node
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            //wait for tx to finish
            await listenForTransactionMine(transactionResponse, provider)
            console.log(`Done!!!!!!!`)
        } catch (e) {
            console.log(e)
        }
    }
}
function listenForTransactionMine(transactionResponse, provider) {
    console.log(`mining ${transactionResponse.hash}.......`)
    //return new Promise
    //listen for this trnasaction to happen
    //here before executing listen for transaction await will make promise to execute first and following that resolve will be called and after that funcrion will be executed
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionRecipt) => {
            console.log(`completed with ${transactionRecipt.confirmations} confirmations`)
            resolve()
        })
    })
    // provider helps to trigger the event by taking the args and one listener function
}
async function getBalance() {
    if (typeof window.ethereum != "undefinded") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance)) //uses only for reading (parse)
    }
}
async function withdraw() {
   console.log("withdrawing.......")
    if (typeof window.ethereum != "undefinded") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner() //get wallet ehichever is connected to provider
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider) //to mine the withdraw again
        } catch (e) {
            log(e)
        }
    }
}
