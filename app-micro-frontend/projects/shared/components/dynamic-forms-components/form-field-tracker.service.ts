import { Injectable } from '@angular/core';
import { signal, Signal } from '@angular/core';
import { FieldConfig } from './field.interface';
import { ComponentRef } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FormFieldTrackerService {
    // Signal to hold the current array of form fields
    private currentFields = signal<FieldConfig[]>([]);

    // Signal to hold the previous array of form fields
    private previousFields = signal<FieldConfig[]>([]);

    // Signal to hold the current form fields mapped by their key
    private currentField = signal<{ [key: string]: FieldConfig }>({});

    // Signal to hold the previous form fields mapped by their key
    private previousField = signal<{ [key: string]: FieldConfig }>({});

    // Signal to hold the current component references mapped by their field key
    private componentRefs = signal<{ [key: string]: ComponentRef<any> }>({});

    // Signal to hold the previous component references mapped by their field key
    private previousComponentRefs = signal<{ [key: string]: ComponentRef<any> }>({});

    /**
     * Updates the array of form fields.
     * Stores the current fields in previousFields before updating with the new fields.
     * 
     * @param newFields - The new array of FieldConfig objects representing the form fields.
     */
    updateFields(newFields: FieldConfig[]): void {
        // Save the current fields into previousFields before updating
        this.previousFields.set(this.currentFields());

        // Update currentFields with the new fields
        this.currentFields.set(newFields);
    }

    /**
     * Retrieves the current array of form fields.
     * 
     * @returns The Signal that holds the current array of FieldConfig objects.
     */
    getCurrentFields(): Signal<FieldConfig[]> {
        return this.currentFields;
    }

    /**
     * Retrieves the previous array of form fields.
     * 
     * @returns The Signal that holds the previous array of FieldConfig objects.
     */
    getPreviousFields(): Signal<FieldConfig[]> {
        return this.previousFields;
    }

    /**
     * Updates a single form field based on its key.
     * Stores the current field in previousField before updating with the new field.
     * 
     * @param newField - A record where the key is a string and the value is a FieldConfig object representing the form field.
     */
    updateField(newField: { [key: string]: FieldConfig }): void {
        // Save the current field into previousField before updating
        this.previousField.set(this.currentField());

        // Merge the new field into the currentField signal
        const tempField = {
            ...this.previousField(),
            ...newField
        };

        // Update currentField with the new field
        this.currentField.set(tempField);
    }

    /**
     * Retrieves the current form field mapped by their key.
     * 
     * @returns The Signal that holds the current Record of FieldConfig objects, keyed by a string.
     */
    getCurrentField(): Signal<{ [key: string]: FieldConfig }> {
        return this.currentField;
    }

    /**
     * Retrieves the previous form field mapped by their key.
     * 
     * @param key - The key of the form field.
     * @returns The FieldConfig associated with the given key.
     */
    getPreviousField(key: string): FieldConfig {
        return this.previousField()[key];
    }

    /**
     * Stores the component reference for a specific field key.
     * 
     * @param itemObj - An object where the key is the field key and the value is the ComponentRef of the component to be tracked.
     */
    updateComponentRef(itemObj: { [key: string]: ComponentRef<any> }): void {
        // Save the current componentRefs into previousComponentRefs before updating
        this.previousComponentRefs.set(this.componentRefs());

        // Merge the new component reference into the current signal
        this.componentRefs.set({
            ...this.previousComponentRefs(),
            ...itemObj
        });
    }

    /**
     * Retrieves the component reference for a specific field key.
     * 
     * @param key - The key of the form field.
     * @returns The ComponentRef associated with the given key, or undefined if not found.
     */
    getComponentRef(key: string): ComponentRef<any> | undefined {
        return this.componentRefs()[key];
    }

    /**
     * Retrieves the previous component reference for a specific field key.
     * 
     * @param key - The key of the form field.
     * @returns The previous ComponentRef associated with the given key, or the current ComponentRef if no previous exists.
     */
    getPreviousComponentRef(key: string): ComponentRef<any> {
        return this.previousComponentRefs()[key];
    }

    /**
     * Checks if a component reference exists for a specific field key.
     * 
     * @param key - The key of the form field.
     * @returns True if a component reference exists, false otherwise.
     */
    hasComponentRef(key: string): boolean {
        return !!this.componentRefs()[key];
    }

    /**
     * Removes the component reference for a specific field key.
     * 
     * @param key - The key of the form field.
     */
    removeComponentRef(key: string): void {
        const updatedComponentRefs = { ...this.componentRefs() };
        delete updatedComponentRefs[key];
        this.componentRefs.set(updatedComponentRefs);
    }
}
