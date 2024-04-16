(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();const c=document.getElementById("guest-name"),h=document.getElementById("guest-list"),C=document.getElementById("submit-button"),m=document.getElementById("allDay"),g=document.getElementById("evening"),p=document.getElementById("ceremony"),E=document.getElementById("children-checklist");m.style.display="none";g.style.display="none";p.style.display="none";E.style.display="none";let u=[];fetch("guests.json").then(i=>i.json()).then(i=>{u=i.allDay.concat(i.evening,i.ceremony);const e=new k;u.forEach(t=>e.populateTable(t,"rsvp-table"))}).catch(i=>{console.error("Error fetching guest list data:",i)});let d=0;c.addEventListener("keyup",function(i){const e=this.value.toLowerCase(),t=u.filter(s=>s.name.toLowerCase().includes(e));if(h.innerHTML="",e.length>=3&&t.length>0){const s=document.createElement("ul");s.classList.add("guest-list"),t.forEach(n=>{const o=document.createElement("li");o.textContent=n.name,o.addEventListener("click",function(){c.value=this.textContent,f()}),s.appendChild(o)}),h.appendChild(s)}else h.textContent=e.length<3?"Type at least 3 characters":"No matches found."});c.addEventListener("keydown",function(i){const e=i.keyCode,t=document.getElementById("suggestions");if(t){if(e===40)d++,y(d);else if(e===38)d--,y(d);else if(e===13){const s=t.querySelector("li.active");s&&(c.value=s.textContent,d=0,f())}}});function y(i){const t=document.getElementById("suggestions").querySelectorAll("li");t&&(L(t),i>=0&&i<t.length&&t[i].classList.add("active"))}function L(i){i.forEach(e=>e.classList.remove("active"))}function f(){const i=document.getElementById("suggestions");i&&i.parentNode.removeChild(i)}class w{constructor(e){this.allGuests=e}findChildrenForGuest(e){var s;const t=this.allGuests.find(n=>n.name.toLowerCase()===e.toLowerCase());return t?(((s=t.children)==null?void 0:s.split(" & "))||[]).map(o=>o.trim()):[]}showGuestChildrenInfo(e,t){const s=this.findChildrenForGuest(e),n=document.getElementById(t);n?s.length>0?(n.textContent=` ${s.join(", ")}`,n.style.display="block"):(n.textContent="This guest does not have any children registered.",n.style.display="block"):console.error(`Target element with ID "${t}" not found.`)}}class I{constructor(e){this.allGuests=e,this.findChildren=new w(e)}verifyGuest(e){const t=this.allGuests.find(s=>s.name.toLowerCase()===e.toLowerCase());return console.log("Found Guest:",t),!!t}getGuestType(e){const t=this.allGuests.find(s=>s.name.toLowerCase()===e.toLowerCase());return t==null?void 0:t.type}getCeremonyAndEveningGuestType(e){const t=this.allGuests.find(s=>s.name.toLowerCase()===e.toLowerCase());return(t==null?void 0:t.type)||"Ceremony & Evening"}getCeremonyGuestType(e){const t=this.allGuests.find(s=>s.name.toLowerCase()===e.toLowerCase());return(t==null?void 0:t.type)||"Ceremony"}showGuestInfo(e){const t=document.getElementById("rsvp");t.style.display="none",this.hideAllGuestTypeDivs();const s=e==null?void 0:e.toLowerCase();if(s==="ceremony"?p.style.display="block":s==="evening"?g.style.display="block":s==="all day"?m.style.display="block":console.error("Guest data has invalid type:",e),document.querySelector(".container.block")){const o=c.value.trim();if(this.allGuests.find(r=>r.name.toLowerCase()===o.toLowerCase())){const r=this.findChildren.findChildrenForGuest(o),a=document.getElementById("children-checklist");a.style.display=r.length>0?"block":"none",this.findChildren.showGuestChildrenInfo(o,"children-names")}}}hideAllGuestTypeDivs(){const e=document.getElementById("allDay"),t=document.getElementById("evening"),s=document.getElementById("ceremony");e.style.display="none",t.style.display="none",s.style.display="none";const n=document.getElementById("children-checklist");n.style.display="none"}}C.addEventListener("click",function(){const i=c.value.trim();if(!i){alert("Please enter your name.");return}const e=new I(u);if(e.verifyGuest(i)){const t=e.getGuestType(i);e.showGuestInfo(t)}else alert("Sorry, guest not found.")});class b{constructor(e){this.allGuests=e,this.thanksDiv=document.getElementById("thanks"),this.otherDivs=document.querySelectorAll(".container:not(#thanks)"),this.addClickEventListener()}addClickEventListener(){const e=document.querySelectorAll("#rsvp-button");e.forEach(t=>{t.addEventListener("click",this.showThanks.bind(this))}),e.length===0&&console.log("rsvp-button not found.")}showThanks(){this.thanksDiv.style.display="block",this.otherDivs.forEach(e=>e.style.display="none")}}new b;class k{constructor(){this.guestNameInput=document.getElementById("guest-name"),this.rsvpListDiv=document.getElementById("rsvp-list"),this.rsvpDiv=document.getElementById("rsvp"),this.guestNameInput.addEventListener("keyup",this.handleGuestNameInput.bind(this))}handleGuestNameInput(e){e.target.value.trim()==="Admin"?(this.rsvpListDiv.style.display="block",this.rsvpDiv.style.display="none"):(this.rsvpListDiv.style.display="none",this.rsvpDiv.style.display="block")}async handleRsvp(){const e=this.guestNameInput.value.trim(),t=this.passwordInput.value.trim();if(e.toLowerCase()==="admin")if(await this.verifyAdmin(t)){this.showRsvpManager();return}else{alert("Invalid password for admin login.");return}}async verifyAdmin(e){try{const s=await(await fetch("guests.json")).json();return s&&s.admin&&s.admin.length>0?s.admin[0].password===e:(console.error("Error fetching or processing admin data from guests.json"),!1)}catch(t){return console.error("Error fetching guests.json:",t),!1}}showRsvpManager(){const e=document.querySelectorAll("div");for(const t of e)t!==this.rsvpListDiv&&(t.style.display="none");this.rsvpListDiv.style.display="block",this.submitButton.addEventListener("click",()=>{console.log("Admin submission")})}handleRsvp(){if(!this.guestNameInput.value.trim()||this.rsvpData.length>0)return;const t=this.collectRsvpData();t.rsvpStatus="Yes",this.rsvpData.push(t);const s=this.getSelectedTable();this.populateTable(t,s),this.clearGuestInput(),this.updateTotals(t);const n=document.querySelectorAll(".delete-checkbox:checked");n.length>0&&console.log("Selected guests for deletion:",n)}collectRsvpData(){const e=this.getSelectedType(),t=this.isAttendingChildrenChecked(),s=document.getElementById("dietary-requirements").value;return{guestName,guestType:e,attendingChildren:t,dietaryRequirements:s}}populateTable(e,t){const s=document.getElementById(`${t}-body`),n=document.createElement("tr"),o=e.rsvpStatus==="Yes"?"green":"gray";let l=e.rsvpDate;if(l){l instanceof Date||(l=new Date(l));const r=String(l.getDate()).padStart(2,"0"),a=String(l.getMonth()+1).padStart(2,"0"),v=l.getFullYear();l=`${r} ${a} ${v}`}n.innerHTML=`
      <td style="color: ${o}">${e.rsvpStatus?"Yes":"No"}</td>
      <td style="color: ${o}">${e.name||""}</td>
      <td style="color: ${o}">${e.type||""}</td>
      <td style="color: ${o}">${e.attendingChildren?"Yes":"No"}</td>
      <td style="color: ${o}">${e.children||""}</td>
      <td style="color: ${o}">${e.dietaryRequirements||""}</td>
      <td style="color: ${o}">${e.ceremony?"Yes":"No"}</td>
      <td style="color: ${o}">${e.reception?"Yes":"No"}</td>
      <td style="color: ${o}">${e.evening?"Yes":"No"}</td>
      <td style="color: ${o}">${e.email||""}</td>
      <td style="color: ${o}">${e.rsvpDate||""}</td> 
      <td><input type="checkbox" class="delete-checkbox"></td>
    `,s.appendChild(n),n.querySelector(".delete-checkbox").addEventListener("click",function(){this.parentNode.parentNode.querySelector("td:first-child").textContent.trim()==="Yes"&&window.confirm("Are you sure you want to delete this row?")&&this.parentNode.parentNode.remove()})}clearGuestInput(){this.guestNameInput.value=""}getSelectedTable(){return""}isAttendingChildrenChecked(){return document.getElementById("children-yes").checked}deleteRsvpEntry(e,t){const n=document.getElementById(`${t}-body`).querySelectorAll("tr");for(const o of n)if(o.querySelector("td").textContent===e.guestName){o.remove(),this.rsvpData=this.rsvpData.filter(l=>l.guestName!==e.guestName),this.updateTotals({...e,attendingChildren:-e.attendingChildren});break}}updateTotals(e){this.totalCounts.guests++,this.totalCounts.attendingChildren+=e.attendingChildren?1:0,document.getElementById("total-guests").textContent=this.totalCounts.guests,document.getElementById("total-attending-children").textContent=this.totalCounts.attendingChildren}}