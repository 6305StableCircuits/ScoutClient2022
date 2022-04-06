<script lang="ts">
	import { Assignment, db } from '../db';

	import { assignmentCount, qualAssignments, quantAssignments } from '../stores';

	import '../app.css';

	if (typeof window !== 'undefined') {
		if (Object.keys($qualAssignments).length === 0 || Object.keys($quantAssignments).length === 0 ) {
			let qual: Record<number, Record<number, Assignment>> = {};
			let quant: Record<number, Record<number, Assignment>> = {};
			db.assignments
				.each((assignment) => {
					if (assignment.type == 'qual') {
						if (qual[assignment.matchNum] === undefined) {
							qual[assignment.matchNum] = { [assignment.student]: assignment };
						} else {
							qual[assignment.matchNum][assignment.student] = assignment;
						}
					} else {
						if (quant[assignment.matchNum] === undefined) {
							quant[assignment.matchNum] = { [assignment.student]: assignment };
						} else {
							quant[assignment.matchNum][assignment.student] = assignment;
						}
					}
				})
				.then(() => {
					qualAssignments.set(qual);
					quantAssignments.set(quant);
				});

			db.assignments.count().then((a) => {
				assignmentCount.set(a);
			});

		}
	}
</script>

<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

<slot />
