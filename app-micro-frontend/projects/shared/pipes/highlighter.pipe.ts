import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	standalone: true,
	name: "highlighter"
})
export class HighlighterPipe implements PipeTransform {

	transform(value: any, args: any,type:string): unknown {
		if(!args) return value;
		if(type==='full'){
			const re = new RegExp("\\b("+args+"\\b)", 'igm');
			value= value.replace(re, '<span class="rounded p-1 shadow bg-[#FFE81A]">$1</span>');
		}
		else{
			const re = new RegExp(args, 'igm');
			value= value.replace(re, '<span class="rounded p-1 shadow bg-[#FFE81A]">$&</span>');
		}

		return value;
	}

}