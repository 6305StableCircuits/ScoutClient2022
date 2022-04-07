
// FORMAT:
// "student.match.team1.alliance" OR "student.match.team1.team2.team3.alliance"
// ie: "student.match.team1.alliance|student2.match.team2.alliance|student3.match.team1.team2.team3.alliance"

import type { Assignment, Result } from "./db";

// ex: "0.1.1678.b|1.1.1671.b|2.1.1671.6305.1678.b"
export function decompressAssignments(compressedString: string) {
  let assignmentArray = compressedString.split("|");

  let out: Array<Assignment> = [];

  assignmentArray.forEach(assignmentStr => {
    let info = assignmentStr.split('.');
    if (info.length == 4) {
      let newAssignment: Assignment = {
        student: parseInt(info[0]),
        team: parseInt(info[2]),
        matchNum: parseInt(info[1]),
        alliance: info[3] as "b" | "r",
        type: "quant"
      }
      out = [...out, newAssignment]
    }
    else if (info.length == 6) {
      let newAssignment: Assignment = {
        student: parseInt(info[0]),
        team: parseInt(info[2]),
        team2: parseInt(info[3]),
        team3: parseInt(info[4]),
        matchNum: parseInt(info[1]),
        alliance: info[5] as "b" | "r",
        type: "qual"
      }
      out = [...out, newAssignment]
    }
  })

  return out;
}
export function formatAssignments(assignments: Array<Assignment>) {
    
}

export function compressResponse(result: Result) {
  return `${result.id}	${result.matchNum}	${result.team}	${result.data.alliance}	${result.data.autoLeave ? 1 : 0}	${result.data.autoLow}	${result.data.autoHigh}	${result.data.teleopLow}	${result.data.rung}	${result.data.fouls}	${result.data.techFouls}	${result.data.incap}`
}
