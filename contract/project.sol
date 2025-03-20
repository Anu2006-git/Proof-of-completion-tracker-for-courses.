// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProofOfCompletion {
    struct CourseCompletion {
        string courseName;
        string institution;
        uint256 completionDate;
        bool isVerified;
    }

    mapping(address => CourseCompletion[]) private completions;
    mapping(address => mapping(string => bool)) private courseExists;
    
    event CourseCompleted(address indexed student, string courseName, string institution, uint256 completionDate);
    
    function addCompletion(string memory _courseName, string memory _institution) public {
        require(!courseExists[msg.sender][_courseName], "Course already added.");
        completions[msg.sender].push(CourseCompletion(_courseName, _institution, block.timestamp, false));
        courseExists[msg.sender][_courseName] = true;
        emit CourseCompleted(msg.sender, _courseName, _institution, block.timestamp);
    }

    function getCompletions(address _student) public view returns (CourseCompletion[] memory) {
        return completions[_student];
    }

    function verifyCompletion(address _student, string memory _courseName) public {
        for (uint i = 0; i < completions[_student].length; i++) {
            if (keccak256(abi.encodePacked(completions[_student][i].courseName)) == keccak256(abi.encodePacked(_courseName))) {
                completions[_student][i].isVerified = true;
            }
        }
    }
}
