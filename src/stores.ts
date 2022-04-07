import { type Writable, writable } from "svelte/store";
import type { Assignment, Competition, Match, Student } from "./db";

export const page: Writable<string> = writable("");
export const modal: Writable<string> = writable("");
export const assignmentCount: Writable<number> = writable(0);

// { matchNum: { studentNum: assignment } }
export const quantAssignments: Writable<Record<number,Record<number, Assignment>>> = writable({});
export const qualAssignments: Writable<Record<number,Record<number, Assignment>>> = writable({});

// { name: id }
export const names: Writable<Record<number, string>> = writable({0: "Adit Singh Sachdeva",1: "Ahmed Amin",2: "Akhil Vallabh",3: "Aleena Munshi",4: "Alexander Rangel",5: "Alison Ouyang",6: "Amulya Nagappala",7: "Andre Amico",8: "Andre Ignacio",9: "Ashton Broussard",10: "Benjamin Brundage",11: "Bijan Zarrinkhameh",12: "Chandrasekhar Sharma",13: "Chris Kiggins",14: "Connor Gahan",15: "Corbin Rangel",16: "Cory Hall",17: "Daniel Wang",18: "Derek Woo",19: "Dhruv Javangula",20: "Gauri Shetty",21: "Gurshaan Janjua",22: "Haroon Ahamed",23: "Hayden Garton",24: "Ishaan Mitroo",25: "Jagshaan Sidhu",26: "Jaiyen Shetty",27: "Jannah Sulton",28: "Jaylyn Cha",29: "Jenny Trexler",30: "Jonah Bedouch",31: "Jovan Kang",32: "Julian Laxamana",33: "Justus Pettit",34: "Kai Shearen",35: "Karaan Shetty",36: "Lance Elep",37: "Landen Lopez",38: "Lauren McLaury",39: "Mack Donich",40: "Manjot Mehat",41: "Max Llanez",42: "Milla Lucido",43: "Milo Cazzell",44: "Mimi Merzoian",45: "Mohammad Aleses",46: "Nabil Yousaf",47: "Nasr Chaudhary",48: "Nathan Le",49: "Nathan Maldonado",50: "Nicole Chien",51: "Nikhil Nair",52: "Parker Stockdale",53: "Patrick Khatchikian",54: "Phillip Brundage",55: "Prabhroop Kang",56: "Rana Eyit",57: "Rohan Otal",58: "Ryan Kwon",59: "Sabrina Affany",60: "Samantha Kong",61: "Samuel Spears",62: "Santiago Sanchez",63: "Sarah Garton",64: "Shreya Vallabh",65: "Sommer Sekhon",66: "Suhana Brjesh",67: "Tiffany Ma",68: "Vasudev Krishna",69: "Zach Liu",70: "Didem Veyisoglu",71: "Can Poyraz Canitez",72: "Ahmet Cengiz",73: "Mahmut Efe Duygun",74: "Emir Erkiletiloglu",75: "Emre Bora Kaynar",76: "Gokhan Korkut",77: "Alisa Kurun",78: "Mayra Sengel",79: "Doruk Sezer",80: "Mrs. E",81: "Mr. E",82: "Mr. Frates",83: "Rocket Man",84: "Mr. Broussard",85: "Mrs. Z",86: "Mr. Gahan"});