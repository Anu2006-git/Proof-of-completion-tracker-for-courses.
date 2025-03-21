const contractAddress = "0x0472eeb3A1a2DDb33D643989FB3aA30c603cC9bd";
const contractABI =[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "student",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "courseName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "institution",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "completionDate",
				"type": "uint256"
			}
		],
		"name": "CourseCompleted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_courseName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_institution",
				"type": "string"
			}
		],
		"name": "addCompletion",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_student",
				"type": "address"
			}
		],
		"name": "getCompletions",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "courseName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "institution",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "completionDate",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isVerified",
						"type": "bool"
					}
				],
				"internalType": "struct ProofOfCompletion.CourseCompletion[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_student",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_courseName",
				"type": "string"
			}
		],
		"name": "verifyCompletion",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]] 

let web3;
let contract;

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        contract = new web3.eth.Contract(contractABI, contractAddress);
        loadCompletions();
    } else {
        alert("Please install MetaMask to use this app.");
    }
});

async function addCompletion() {
    const courseName = document.getElementById("courseName").value;
    const institution = document.getElementById("institution").value;
    const accounts = await web3.eth.getAccounts();
    await contract.methods.addCompletion(courseName, institution).send({ from: accounts[0] });
    loadCompletions();
}

async function loadCompletions() {
    const accounts = await web3.eth.getAccounts();
    const courses = await contract.methods.getCompletions(accounts[0]).call();
    const courseList = document.getElementById("courseList");
    courseList.innerHTML = "";
    courses.forEach(course => {
        const li = document.createElement("li");
        li.textContent = `${course.courseName} - ${course.institution} (${course.isVerified ? "Verified" : "Pending"})`;
        courseList.appendChild(li);
    });
}
