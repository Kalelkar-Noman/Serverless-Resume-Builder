import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ResumeStateService } from '../../core/services/resume-state.service';
import {
  CustomLink,
  ResumeData,
  ResumeSection,
  SectionType,
  SkillsGridItem,
  TimelineItem,
} from '../../core/models/resume.model';
import { Subject, takeUntil, take } from 'rxjs';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-form-editor',
  standalone: true,
  imports: [ReactiveFormsModule, QuillModule, DragDropModule],
  template: `
    <form [formGroup]="resumeForm" class="space-y-6 p-4 bg-brand-card rounded shadow-sm">
      <!-- Template Selection Upgrade -->
      <div class="mb-8 p-6 bg-brand-base rounded-xl shadow-sm border border-brand-border">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-brand-main">Templates we recommend for you</h2>
          <p class="text-brand-muted mt-1">
            You can always change your template later. Colors and fonts adapt automatically.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Base Template -->
          <label class="group cursor-pointer relative block">
            <input type="radio" formControlName="templateId" value="base" class="peer sr-only" />

            <div
              class="border-2 border-transparent rounded-xl bg-brand-card shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 peer-checked:border-brand-accent peer-checked:shadow-brand-accent/20 peer-checked:shadow-lg hover:shadow-xl relative h-[350px] flex flex-col"
            >
              <!-- Checkmark badge for selected -->
              <div
                class="absolute top-3 left-3 bg-brand-accent text-white rounded-full p-1 opacity-0 peer-checked:opacity-100 transition-opacity z-30 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>

              <!-- Thumbnail Area (CSS Miniature) -->
              <div class="flex-1 bg-gray-50 relative overflow-hidden flex justify-center pt-6 px-4">
                <div
                  class="w-full bg-white shadow-sm border border-gray-200 h-full rounded-t-sm flex flex-col items-center p-3 gap-2"
                >
                  <div class="w-16 h-2 bg-gray-800 rounded-full mt-2"></div>
                  <div class="w-24 h-1.5 bg-gray-400 rounded-full"></div>
                  <div class="flex gap-1">
                    <div class="w-6 h-1 bg-gray-300 rounded-full"></div>
                    <div class="w-6 h-1 bg-gray-300 rounded-full"></div>
                    <div class="w-6 h-1 bg-gray-300 rounded-full"></div>
                  </div>
                  <div class="w-full h-[1px] bg-gray-200 my-1"></div>
                  <div class="w-full flex flex-col gap-1.5">
                    <div class="w-12 h-1.5 bg-brand-accent rounded-full mb-1"></div>
                    <div class="w-full h-1 bg-gray-200 rounded-full"></div>
                    <div class="w-5/6 h-1 bg-gray-200 rounded-full"></div>
                    <div class="w-4/6 h-1 bg-gray-200 rounded-full"></div>
                  </div>
                  <div class="w-full flex flex-col gap-1.5 mt-2">
                    <div class="w-12 h-1.5 bg-brand-accent rounded-full mb-1"></div>
                    <div class="w-full h-1 bg-gray-200 rounded-full"></div>
                    <div class="w-5/6 h-1 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>

              <!-- Hover Overlay -->
              <div
                class="absolute inset-0 bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 peer-checked:group-hover:opacity-0 transition-opacity duration-300 flex items-center justify-center z-20"
              >
                <div
                  class="bg-brand-accent text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105 pointer-events-none"
                >
                  Choose
                </div>
              </div>
            </div>
            <div class="mt-4 text-center">
              <span class="font-bold text-brand-main text-lg">Standard Base</span>
            </div>
          </label>

          <!-- Modern Template (Recommended) -->
          <label class="group cursor-pointer relative block">
            <input type="radio" formControlName="templateId" value="modern" class="peer sr-only" />

            <div
              class="border-2 border-transparent rounded-xl bg-brand-card shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 peer-checked:border-brand-accent peer-checked:shadow-brand-accent/20 peer-checked:shadow-lg hover:shadow-xl relative h-[350px] flex flex-col"
            >
              <div
                class="absolute top-3 left-3 bg-brand-accent text-white rounded-full p-1 opacity-0 peer-checked:opacity-100 transition-opacity z-30 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>

              <span
                class="absolute top-3 right-3 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded z-30 peer-checked:hidden"
                >Recommended</span
              >

              <div class="flex-1 bg-gray-50 relative overflow-hidden flex justify-center pt-6 px-4">
                <div
                  class="w-full bg-white shadow-sm border border-gray-200 h-full rounded-t-sm flex overflow-hidden"
                >
                  <div class="w-1/3 bg-gray-100 border-r border-gray-200 flex flex-col p-2 gap-2">
                    <div class="w-8 h-8 rounded-full bg-gray-300 self-center mt-2 mb-1"></div>
                    <div class="w-full h-1 bg-gray-300 rounded-full"></div>
                    <div class="w-5/6 h-1 bg-gray-300 rounded-full"></div>
                    <div class="w-full h-1 bg-gray-300 rounded-full mt-2"></div>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <div class="w-6 h-2 bg-gray-300 rounded-sm"></div>
                      <div class="w-8 h-2 bg-gray-300 rounded-sm"></div>
                      <div class="w-5 h-2 bg-gray-300 rounded-sm"></div>
                    </div>
                  </div>
                  <div class="w-2/3 p-3 flex flex-col gap-2">
                    <div class="w-16 h-2 bg-gray-800 rounded-full"></div>
                    <div class="w-24 h-1.5 bg-brand-accent rounded-full"></div>
                    <div class="w-full h-0.5 bg-gray-100 my-1"></div>

                    <div class="w-12 h-1.5 bg-gray-800 rounded-full mb-1"></div>
                    <div class="flex gap-2">
                      <div class="w-1 h-6 bg-brand-accent"></div>
                      <div class="flex-1 flex flex-col gap-1">
                        <div class="w-full h-1 bg-gray-200 rounded-full"></div>
                        <div class="w-5/6 h-1 bg-gray-200 rounded-full"></div>
                        <div class="w-4/6 h-1 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="absolute inset-0 bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 peer-checked:group-hover:opacity-0 transition-opacity duration-300 flex items-center justify-center z-20"
              >
                <div
                  class="bg-brand-accent text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105 pointer-events-none"
                >
                  Choose
                </div>
              </div>
            </div>
            <div class="mt-4 text-center">
              <span class="font-bold text-brand-main text-lg">Split Modern</span>
            </div>
          </label>

          <!-- Minimalist Template -->
          <label class="group cursor-pointer relative block">
            <input
              type="radio"
              formControlName="templateId"
              value="minimalist"
              class="peer sr-only"
            />

            <div
              class="border-2 border-transparent rounded-xl bg-brand-card shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 peer-checked:border-brand-accent peer-checked:shadow-brand-accent/20 peer-checked:shadow-lg hover:shadow-xl relative h-[350px] flex flex-col"
            >
              <div
                class="absolute top-3 left-3 bg-brand-accent text-white rounded-full p-1 opacity-0 peer-checked:opacity-100 transition-opacity z-30 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>

              <div class="flex-1 bg-gray-50 relative overflow-hidden flex justify-center pt-6 px-4">
                <div
                  class="w-full bg-white shadow-sm border border-gray-200 h-full rounded-t-sm p-4 flex flex-col gap-2"
                >
                  <div class="w-20 h-2 bg-gray-800 rounded-sm"></div>
                  <div class="w-24 h-1.5 bg-gray-400 rounded-sm"></div>
                  <div class="flex gap-2 mt-1">
                    <div class="w-10 h-1 bg-gray-300 rounded-sm"></div>
                    <div class="w-10 h-1 bg-gray-300 rounded-sm"></div>
                  </div>

                  <div class="w-full flex mt-3 gap-2">
                    <div class="w-1/4">
                      <div class="w-full h-1.5 bg-gray-800 rounded-sm"></div>
                    </div>
                    <div class="w-3/4 flex flex-col gap-1">
                      <div class="w-full h-1 bg-gray-200 rounded-sm"></div>
                      <div class="w-5/6 h-1 bg-gray-200 rounded-sm"></div>
                      <div class="w-4/6 h-1 bg-gray-200 rounded-sm"></div>
                    </div>
                  </div>
                  <div class="w-full flex mt-2 gap-2">
                    <div class="w-1/4">
                      <div class="w-full h-1.5 bg-gray-800 rounded-sm"></div>
                    </div>
                    <div class="w-3/4 flex flex-col gap-1">
                      <div class="w-full h-1 bg-gray-200 rounded-sm"></div>
                      <div class="w-5/6 h-1 bg-gray-200 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="absolute inset-0 bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 peer-checked:group-hover:opacity-0 transition-opacity duration-300 flex items-center justify-center z-20"
              >
                <div
                  class="bg-brand-accent text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105 pointer-events-none"
                >
                  Choose
                </div>
              </div>
            </div>
            <div class="mt-4 text-center">
              <span class="font-bold text-brand-main text-lg">Clean Minimalist</span>
            </div>
          </label>

          <!-- Terminal Template -->
          <label class="group cursor-pointer relative block">
            <input
              type="radio"
              formControlName="templateId"
              value="terminal"
              class="peer sr-only"
            />

            <div
              class="border-2 border-transparent rounded-xl bg-brand-card shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 peer-checked:border-brand-accent peer-checked:shadow-brand-accent/20 peer-checked:shadow-lg hover:shadow-xl relative h-[350px] flex flex-col"
            >
              <div
                class="absolute top-3 left-3 bg-brand-accent text-white rounded-full p-1 opacity-0 peer-checked:opacity-100 transition-opacity z-30 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>

              <div class="flex-1 bg-gray-50 relative overflow-hidden flex justify-center pt-6 px-4">
                <div
                  class="w-full bg-gray-900 shadow-sm border border-gray-700 h-full rounded-t-sm p-3 flex flex-col gap-2 font-mono"
                >
                  <div class="w-24 h-2 bg-green-400 rounded-sm"></div>
                  <div class="w-32 h-1.5 bg-green-400/70 rounded-sm"></div>
                  <div class="flex gap-2 mt-1">
                    <div class="w-8 h-1 bg-green-400/50 rounded-sm"></div>
                    <div class="w-8 h-1 bg-green-400/50 rounded-sm"></div>
                  </div>

                  <div class="w-full flex flex-col mt-3 gap-1.5">
                    <div class="flex items-center gap-1">
                      <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div class="w-16 h-1.5 bg-green-400 rounded-sm"></div>
                    </div>
                    <div class="w-full h-1 bg-green-400/50 rounded-sm ml-3"></div>
                    <div class="w-5/6 h-1 bg-green-400/50 rounded-sm ml-3"></div>
                    <div class="w-4/6 h-1 bg-green-400/50 rounded-sm ml-3"></div>
                  </div>
                  <div class="w-full flex flex-col mt-2 gap-1.5">
                    <div class="flex items-center gap-1">
                      <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div class="w-16 h-1.5 bg-green-400 rounded-sm"></div>
                    </div>
                    <div class="w-full h-1 bg-green-400/50 rounded-sm ml-3"></div>
                  </div>
                </div>
              </div>

              <div
                class="absolute inset-0 bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 peer-checked:group-hover:opacity-0 transition-opacity duration-300 flex items-center justify-center z-20"
              >
                <div
                  class="bg-brand-accent text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105 pointer-events-none"
                >
                  Choose
                </div>
              </div>
            </div>
            <div class="mt-4 text-center">
              <span class="font-bold text-brand-main text-lg">Terminal Coder</span>
            </div>
          </label>
        </div>
      </div>

      <!-- Data Management -->
      <fieldset class="border p-4 rounded-md shadow-sm bg-brand-base mb-8">
        <legend class="text-lg font-semibold px-2 text-brand-main">Data Management</legend>
        <div class="flex flex-col sm:flex-row gap-4 mt-2">
          <button
            type="button"
            (click)="exportJson()"
            class="flex-1 py-2 font-semibold bg-white text-brand-main border border-gray-300 hover:bg-gray-50 rounded shadow-sm transition-colors text-center"
          >
            Export Data (JSON)
          </button>
          <div class="flex-1 relative">
            <input
              type="file"
              accept=".json"
              (change)="importJson($event)"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <button
              type="button"
              class="w-full h-full py-2 font-semibold bg-white text-brand-main border border-gray-300 hover:bg-gray-50 rounded shadow-sm transition-colors text-center"
            >
              Import Data (JSON)
            </button>
          </div>
        </div>
      </fieldset>

      <!-- Design Settings -->
      <fieldset class="border p-4 rounded-md shadow-sm bg-brand-base">
        <legend class="text-lg font-semibold px-2 text-brand-main">Design Settings</legend>
        <div formGroupName="design" class="flex flex-col md:flex-row gap-6 mt-2">
          <div class="flex-1">
            <div class="label-style mb-2 block">Theme Colors</div>
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label for="theme-text" class="text-xs text-brand-muted block mb-1">Text</label>
                <input
                  id="theme-text"
                  type="color"
                  formControlName="text"
                  class="w-full h-8 cursor-pointer rounded border border-brand-border"
                />
              </div>
              <div>
                <label for="theme-bg" class="text-xs text-brand-muted block mb-1">Background</label>
                <input
                  id="theme-bg"
                  type="color"
                  formControlName="background"
                  class="w-full h-8 cursor-pointer rounded border border-brand-border"
                />
              </div>
              <div>
                <label for="theme-highlight" class="text-xs text-brand-muted block mb-1"
                  >Highlight</label
                >
                <input
                  id="theme-highlight"
                  type="color"
                  formControlName="highlight"
                  class="w-full h-8 cursor-pointer rounded border border-brand-border"
                />
              </div>
              <div>
                <label for="theme-surface" class="text-xs text-brand-muted block mb-1"
                  >Surface / Sidebar</label
                >
                <input
                  id="theme-surface"
                  type="color"
                  formControlName="surface"
                  class="w-full h-8 cursor-pointer rounded border border-brand-border"
                />
              </div>
            </div>

            <div class="flex gap-2">
              <button
                type="button"
                (click)="applyThemePreset('default')"
                class="text-xs bg-brand-accent text-white px-2 py-1 rounded hover:opacity-90"
              >
                Default
              </button>
              <button
                type="button"
                (click)="applyThemePreset('light')"
                class="text-xs bg-gray-100 text-gray-800 border border-gray-300 px-2 py-1 rounded hover:bg-gray-200"
              >
                Light
              </button>
              <button
                type="button"
                (click)="applyThemePreset('dark')"
                class="text-xs bg-gray-800 text-gray-100 border border-gray-700 px-2 py-1 rounded hover:bg-gray-900"
              >
                Dark
              </button>
              <button
                type="button"
                (click)="applyThemePreset('matrix')"
                class="text-xs bg-black text-green-400 border border-green-800 px-2 py-1 rounded hover:bg-gray-900"
              >
                Matrix
              </button>
            </div>
          </div>

          <div class="flex-1">
            <div class="label-style mb-2 block">Typography</div>
            <div class="flex flex-col gap-2">
              <label
                class="cursor-pointer relative flex items-center gap-2 p-2 border border-brand-border rounded hover:bg-brand-card transition-colors"
              >
                <input type="radio" formControlName="font" value="font-sans" class="peer sr-only" />
                <div
                  class="w-4 h-4 rounded-full border border-brand-muted peer-checked:border-brand-accent peer-checked:bg-brand-accent transition-all flex-shrink-0"
                ></div>
                <span class="font-sans text-brand-main">Sans-Serif (Modern)</span>
              </label>
              <label
                class="cursor-pointer relative flex items-center gap-2 p-2 border border-brand-border rounded hover:bg-brand-card transition-colors"
              >
                <input
                  type="radio"
                  formControlName="font"
                  value="font-serif"
                  class="peer sr-only"
                />
                <div
                  class="w-4 h-4 rounded-full border border-brand-muted peer-checked:border-brand-accent peer-checked:bg-brand-accent transition-all flex-shrink-0"
                ></div>
                <span class="font-serif text-brand-main">Serif (Classic)</span>
              </label>
              <label
                class="cursor-pointer relative flex items-center gap-2 p-2 border border-brand-border rounded hover:bg-brand-card transition-colors"
              >
                <input type="radio" formControlName="font" value="font-mono" class="peer sr-only" />
                <div
                  class="w-4 h-4 rounded-full border border-brand-muted peer-checked:border-brand-accent peer-checked:bg-brand-accent transition-all flex-shrink-0"
                ></div>
                <span class="font-mono text-brand-main">Monospace (Technical)</span>
              </label>
            </div>
          </div>

          <!-- Document Settings -->
          <div class="flex-1">
            <div class="label-style mb-2 block">Document Settings</div>

            <div class="mb-4">
              <label for="doc-size" class="text-xs text-brand-muted block mb-1">Paper Size</label>
              <select id="doc-size" formControlName="documentSize" class="input-style">
                <option value="a4">A4 (Standard)</option>
                <option value="letter">US Letter</option>
              </select>
            </div>

            <div>
              <label for="doc-margins" class="text-xs text-brand-muted block mb-1">Margins</label>
              <select id="doc-margins" formControlName="margins" class="input-style">
                <option value="standard">Standard (Wide)</option>
                <option value="narrow">Narrow (Compact)</option>
                <option value="none">None (Full Bleed)</option>
              </select>
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset class="border p-4 rounded-md shadow-sm bg-brand-base">
        <legend class="text-lg font-semibold px-2 text-brand-main">Personal Information</legend>
        <div formGroupName="personalInfo" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div class="flex flex-col">
            <label for="name" class="label-style">Name</label>
            <input id="name" type="text" formControlName="name" class="input-style" />
          </div>
          <div class="flex flex-col">
            <label for="title" class="label-style">Title</label>
            <input id="title" type="text" formControlName="title" class="input-style" />
          </div>
          <div class="flex flex-col">
            <label for="email" class="label-style">Email</label>
            <input id="email" type="email" formControlName="email" class="input-style" />
          </div>
          <div class="flex flex-col">
            <label for="phone" class="label-style">Phone</label>
            <input id="phone" type="tel" formControlName="phone" class="input-style" />
          </div>
          <div class="flex flex-col md:col-span-2">
            <label for="location" class="label-style">Location</label>
            <input id="location" type="text" formControlName="location" class="input-style" />
          </div>

          <div class="md:col-span-2 mt-4">
            <h3 class="text-md font-medium text-brand-muted mb-2">Custom Links</h3>
            <div
              formArrayName="customLinks"
              class="space-y-3"
              cdkDropList
              (cdkDropListDropped)="onItemDrop($event, customLinks)"
            >
              @for (linkGroup of customLinks.controls; track linkGroup; let i = $index) {
                <div
                  [formGroupName]="i"
                  class="grid grid-cols-1 gap-2 p-3 border rounded-md bg-brand-card"
                  cdkDrag
                  [cdkDragDisabled]="isMobile"
                >
                  <div
                    cdkDragHandle
                    class="hidden lg:flex cursor-move self-center text-brand-muted hover:text-brand-main flex-shrink-0 pr-1"
                    title="Drag to reorder"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 8h16M4 16h16"
                      />
                    </svg>
                  </div>
                  <div class="w-full">
                    <label [for]="'link-label-' + i" class="label-style">Label</label>
                    <input
                      [id]="'link-label-' + i"
                      type="text"
                      formControlName="label"
                      class="input-style"
                    />
                  </div>
                  <div class="w-full">
                    <label [for]="'link-url-' + i" class="label-style">URL</label>
                    <input
                      [id]="'link-url-' + i"
                      type="url"
                      formControlName="url"
                      class="input-style"
                    />
                  </div>
                  <div class="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      (click)="moveCustomLinkUp(i)"
                      [disabled]="i === 0"
                      class="btn-secondary px-2 disabled:opacity-50"
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      (click)="moveCustomLinkDown(i)"
                      [disabled]="i === customLinks.length - 1"
                      class="btn-secondary px-2 disabled:opacity-50"
                      title="Move Down"
                    >
                      ↓
                    </button>
                    <button type="button" (click)="removeCustomLink(i)" class="btn-danger ml-2">
                      Remove
                    </button>
                  </div>
                </div>
              }
            </div>
            <button type="button" (click)="addCustomLink()" class="btn-secondary mt-3">
              Add Custom Link
            </button>
          </div>
        </div>
      </fieldset>

      <fieldset class="border p-4 rounded-md shadow-sm bg-brand-base">
        <legend class="text-lg font-semibold px-2 text-brand-main">Summary</legend>
        <quill-editor
          formControlName="summary"
          [styles]="{ 'min-height': '150px' }"
          class="mt-2"
        ></quill-editor>
      </fieldset>

      <fieldset class="border p-4 rounded-md shadow-sm bg-brand-base">
        <legend class="text-lg font-semibold px-2 text-brand-main">Sections</legend>
        <div
          formArrayName="sections"
          class="space-y-4 mt-2"
          cdkDropList
          (cdkDropListDropped)="onSectionDrop($event)"
        >
          @for (sectionGroup of sections.controls; track sectionGroup; let i = $index) {
            <div
              [formGroupName]="i"
              class="border rounded-md shadow-sm bg-brand-card space-y-4 relative lg:pl-8"
              cdkDrag
              [cdkDragDisabled]="isMobile"
            >
              <!-- DRAG HANDLE -->
              <div
                cdkDragHandle
                class="hidden lg:flex absolute left-0 top-0 bottom-0 w-8 items-center justify-center cursor-move text-brand-muted hover:text-brand-main bg-brand-base border-r rounded-l-md"
                title="Drag to reorder"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              </div>
              <div class="p-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="w-full">
                    <label [for]="'section-title-' + i" class="label-style">Section Title</label>
                    <input
                      [id]="'section-title-' + i"
                      type="text"
                      formControlName="title"
                      class="input-style"
                    />
                  </div>
                  <div class="w-full">
                    <label [for]="'section-type-' + i" class="label-style">Section Type</label>
                    <select
                      [id]="'section-type-' + i"
                      formControlName="type"
                      class="input-style"
                      (change)="onSectionTypeChange(i)"
                    >
                      <option value="timeline">Timeline</option>
                      <option value="skills-grid">Skills Grid</option>
                      <option value="custom-rich-text">Custom Rich Text</option>
                    </select>
                  </div>
                  <div class="flex items-center gap-1 flex-shrink-0 sm:col-span-2 mt-1">
                    <button
                      type="button"
                      (click)="moveSectionUp(i)"
                      [disabled]="i === 0"
                      class="btn-secondary px-2 disabled:opacity-50"
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      (click)="moveSectionDown(i)"
                      [disabled]="i === sections.length - 1"
                      class="btn-secondary px-2 disabled:opacity-50"
                      title="Move Down"
                    >
                      ↓
                    </button>
                    <button type="button" (click)="removeSection(i)" class="btn-danger ml-2">
                      Remove Section
                    </button>
                  </div>
                </div>
                @switch (sectionGroup.get('type')?.value) {
                  @case ('timeline') {
                    <div class="px-4 pb-4">
                      <div
                        formArrayName="items"
                        class="space-y-3 mt-3"
                        cdkDropList
                        (cdkDropListDropped)="onItemDrop($event, getSectionItems(i))"
                      >
                        <h4 class="text-md font-medium text-brand-muted mb-2">Timeline Items</h4>
                        @for (
                          itemGroup of getSectionItems(i).controls;
                          track itemGroup;
                          let j = $index
                        ) {
                          <div
                            [formGroupName]="j"
                            class="grid grid-cols-1 gap-2 p-3 border rounded-md bg-brand-base"
                            cdkDrag
                            [cdkDragDisabled]="isMobile"
                          >
                            <div
                              cdkDragHandle
                              class="hidden lg:flex cursor-move self-center text-brand-muted hover:text-brand-main flex-shrink-0 pr-1"
                              title="Drag to reorder"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M4 8h16M4 16h16"
                                />
                              </svg>
                            </div>
                            <div class="w-full">
                              <label [for]="'timeline-headline-' + i + '-' + j" class="label-style"
                                >Headline</label
                              >
                              <input
                                [id]="'timeline-headline-' + i + '-' + j"
                                type="text"
                                formControlName="headline"
                                class="input-style"
                              />
                            </div>
                            <div class="w-full">
                              <label
                                [for]="'timeline-subheading-' + i + '-' + j"
                                class="label-style"
                                >Subheading</label
                              >
                              <input
                                [id]="'timeline-subheading-' + i + '-' + j"
                                type="text"
                                formControlName="subheading"
                                class="input-style"
                              />
                            </div>
                            <div class="w-full sm:w-40">
                              <label [for]="'timeline-date-' + i + '-' + j" class="label-style"
                                >Date Range</label
                              >
                              <input
                                [id]="'timeline-date-' + i + '-' + j"
                                type="text"
                                formControlName="date"
                                class="input-style"
                              />
                            </div>
                            <div class="w-full">
                              <p class="label-style">Description</p>
                              <quill-editor
                                formControlName="description"
                                [styles]="{ 'min-height': '150px' }"
                              ></quill-editor>
                            </div>
                            <div class="flex items-center gap-1 flex-wrap">
                              <button
                                type="button"
                                (click)="moveTimelineItemUp(i, j)"
                                [disabled]="j === 0"
                                class="btn-secondary px-2 disabled:opacity-50"
                                title="Move Up"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                (click)="moveTimelineItemDown(i, j)"
                                [disabled]="j === getSectionItems(i).length - 1"
                                class="btn-secondary px-2 disabled:opacity-50"
                                title="Move Down"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                (click)="removeTimelineItem(i, j)"
                                class="btn-danger ml-2"
                              >
                                Remove Item
                              </button>
                            </div>
                          </div>
                        }
                        <button
                          type="button"
                          (click)="addTimelineItem(i)"
                          class="btn-secondary mt-3"
                        >
                          Add Timeline Item
                        </button>
                      </div>
                    </div>
                  }
                  @case ('skills-grid') {
                    <div class="px-4 pb-4">
                      <div
                        formArrayName="skillTags"
                        class="space-y-3 mt-3"
                        cdkDropList
                        (cdkDropListDropped)="onItemDrop($event, getSectionSkills(i))"
                      >
                        <h4 class="text-md font-medium text-brand-muted mb-2">Skills</h4>
                        @for (
                          skillGroup of getSectionSkills(i).controls;
                          track skillGroup;
                          let j = $index
                        ) {
                          <div
                            [formGroupName]="j"
                            class="grid grid-cols-1 gap-2 p-3 border rounded-md bg-brand-base"
                            cdkDrag
                            [cdkDragDisabled]="isMobile"
                          >
                            <div
                              cdkDragHandle
                              class="hidden lg:flex cursor-move self-center text-brand-muted hover:text-brand-main flex-shrink-0 pr-1"
                              title="Drag to reorder"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M4 8h16M4 16h16"
                                />
                              </svg>
                            </div>
                            <div class="w-full">
                              <label [for]="'skill-name-' + i + '-' + j" class="label-style"
                                >Skill Name</label
                              >
                              <input
                                [id]="'skill-name-' + i + '-' + j"
                                type="text"
                                formControlName="name"
                                class="input-style"
                              />
                            </div>
                            <div class="w-full sm:w-40">
                              <label [for]="'skill-level-' + i + '-' + j" class="label-style"
                                >Level</label
                              >
                              <select
                                [id]="'skill-level-' + i + '-' + j"
                                formControlName="level"
                                class="input-style"
                              >
                                <option value="">(Optional)</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="expert">Expert</option>
                              </select>
                            </div>
                            <div class="flex items-center gap-1 flex-shrink-0">
                              <button
                                type="button"
                                (click)="moveSkillItemUp(i, j)"
                                [disabled]="j === 0"
                                class="btn-secondary px-2 disabled:opacity-50"
                                title="Move Up"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                (click)="moveSkillItemDown(i, j)"
                                [disabled]="j === getSectionSkills(i).length - 1"
                                class="btn-secondary px-2 disabled:opacity-50"
                                title="Move Down"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                (click)="removeSkillItem(i, j)"
                                class="btn-danger ml-2"
                              >
                                Remove Skill
                              </button>
                            </div>
                          </div>
                        }
                        <button type="button" (click)="addSkillItem(i)" class="btn-secondary mt-3">
                          Add Skill
                        </button>
                      </div>
                    </div>
                  }
                  @case ('custom-rich-text') {
                    <div>
                      <h4 class="text-md font-medium text-brand-muted mb-2">Custom Content</h4>
                      <quill-editor
                        formControlName="customHtmlContent"
                        [styles]="{ 'min-height': '150px' }"
                      ></quill-editor>
                    </div>
                  }
                }
              </div>
            </div>
          }
        </div>
        <button type="button" (click)="addSection()" class="btn-primary mt-6">
          Add New Section
        </button>
      </fieldset>
    </form>
  `,
  styles: [
    `
      .label-style {
        @apply block text-sm font-medium text-brand-main mb-1;
      }
      .input-style {
        @apply mt-1 block w-full rounded-md border-brand-border shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm p-2;
      }
      .btn-primary {
        @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-accent hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent;
      }
      .btn-secondary {
        @apply inline-flex items-center px-4 py-2 border border-brand-border text-sm font-medium rounded-md text-brand-main bg-brand-card hover:bg-brand-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent;
      }
      .btn-danger {
        @apply inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500;
      }
      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow:
          0 5px 5px -3px rgba(0, 0, 0, 0.2),
          0 8px 10px 1px rgba(0, 0, 0, 0.14),
          0 3px 14px 2px rgba(0, 0, 0, 0.12);
        background: white;
        padding: 0.5rem;
      }
      .cdk-drag-placeholder {
        opacity: 0.3;
      }
      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .space-y-4.cdk-drop-list-dragging .cdk-drag,
      .space-y-3.cdk-drop-list-dragging .cdk-drag {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      :host ::ng-deep .ql-editor {
        color: var(--brand-main);
        background-color: var(--brand-card);
        border-radius: 0.375rem;
        border: 1px solid var(--brand-border);
        padding: 1rem;
        font-size: 0.875rem;
      }
      :host ::ng-deep .ql-editor img,
      :host ::ng-deep .ql-editor svg,
      :host ::ng-deep .ql-editor video {
        max-width: 100%;
        height: auto;
      }
      :host ::ng-deep .ql-editor svg {
        display: inline-block !important;
        vertical-align: middle !important;
        max-height: 2em !important;
        max-width: 2em !important;
        width: auto !important;
        height: auto !important;
      }
      :host ::ng-deep .ql-toolbar {
        background-color: var(--brand-base);
        border-top-left-radius: 0.375rem;
        border-top-right-radius: 0.375rem;
        border-left: 1px solid var(--brand-border);
        border-right: 1px solid var(--brand-border);
        border-top: 1px solid var(--brand-border);
      }
      :host ::ng-deep .ql-toolbar svg {
        display: inline-block !important;
        vertical-align: middle !important;
        width: 18px !important;
        height: 18px !important;
      }
      :host-context(.dark) ::ng-deep .ql-toolbar svg {
        filter: invert(1) hue-rotate(180deg);
      }
      :host-context(.dark) ::ng-deep .ql-picker-options {
        background-color: var(--brand-card);
      }
      :host ::ng-deep .ql-container {
        border-bottom-left-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
        border-left: 1px solid var(--brand-border);
        border-right: 1px solid var(--brand-border);
        border-bottom: 1px solid var(--brand-border);
      }
    `,
  ],
})
export class FormEditorComponent implements OnInit, OnDestroy {
  private resumeStateService = inject(ResumeStateService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  resumeForm!: FormGroup;
  isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  }

  ngOnInit(): void {
    this.resumeForm = this.fb.group({
      templateId: ['base'],
      design: this.fb.group({
        text: ['#1F2937'],
        background: ['#FFFFFF'],
        highlight: ['#4F46E5'],
        surface: ['#EEF2FF'],
        font: ['font-sans'],
        documentSize: ['a4'],
        margins: ['standard'],
      }),
      personalInfo: this.fb.group({
        name: ['', Validators.required],
        title: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        location: [''],
        customLinks: this.fb.array([]),
      }),
      summary: [''],
      sections: this.fb.array([]),
    });

    // BUG FIX: Use take(1) to only hydrate the form ONCE on load.
    // This prevents the form from continuously destroying/rebuilding arrays while the user types.
    this.resumeStateService.resumeData$.pipe(take(1)).subscribe((data) => {
      this.patchForm(data);
    });

    this.resumeForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.resumeStateService.updateResumeState(value as ResumeData);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  exportJson(): void {
    const data = this.resumeForm.getRawValue();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${data.personalInfo?.name?.replace(/\s+/g, '-').toLowerCase() || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importJson(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const data = JSON.parse(json);
        if (data && data.personalInfo && data.sections) {
          this.patchForm(data);
        } else {
          alert('Invalid resume data file.');
        }
      } catch {
        alert('Failed to parse JSON file.');
      }
      input.value = '';
    };
    reader.readAsText(file);
  }

  applyThemePreset(preset: 'default' | 'dark' | 'light' | 'matrix'): void {
    const designGroup = this.resumeForm.get('design');
    if (!designGroup) return;

    switch (preset) {
      case 'default':
        designGroup.patchValue({
          text: '#1F2937',
          background: '#FFFFFF',
          highlight: '#4F46E5',
          surface: '#EEF2FF',
          font: 'font-sans',
        });
        break;
      case 'dark':
        designGroup.patchValue({
          text: '#E5E7EB',
          background: '#111827',
          highlight: '#3B82F6',
          surface: '#1F2937',
          font: 'font-sans',
        });
        break;
      case 'light':
        designGroup.patchValue({
          text: '#1F2937',
          background: '#FFFFFF',
          highlight: '#4F46E5',
          surface: '#EEF2FF',
          font: 'font-sans',
        });
        break;
      case 'matrix':
        designGroup.patchValue({
          text: '#4ADE80',
          background: '#000000',
          highlight: '#22C55E',
          surface: '#064E3B',
          font: 'font-mono',
        });
        break;
    }
  }

  private patchForm(data: ResumeData): void {
    this.resumeForm.patchValue(
      {
        templateId: data.templateId || 'base',
        personalInfo: data.personalInfo,
        summary: data.summary,
      },
      { emitEvent: false },
    );

    this.customLinks.clear({ emitEvent: false });
    data.personalInfo.customLinks.forEach((link) => {
      this.customLinks.push(this.createCustomLink(link), { emitEvent: false });
    });

    this.sections.clear({ emitEvent: false });
    data.sections.forEach((section) => {
      const sectionGroup = this.createSection(section.type, section);
      this.sections.push(sectionGroup, { emitEvent: false });
    });
  }

  get personalInfo(): FormGroup {
    return this.resumeForm.get('personalInfo') as FormGroup;
  }
  get customLinks(): FormArray {
    return this.personalInfo.get('customLinks') as FormArray;
  }
  get sections(): FormArray {
    return this.resumeForm.get('sections') as FormArray;
  }

  createCustomLink(link?: CustomLink): FormGroup {
    return this.fb.group({
      label: [link?.label || '', Validators.required],
      url: [
        link?.url || '',
        [Validators.required, Validators.pattern('^(https?|ftp)://[^\\s/$.?#].[^\\s]*$')],
      ],
    });
  }

  addCustomLink(): void {
    this.customLinks.push(this.createCustomLink());
  }
  removeCustomLink(index: number): void {
    this.customLinks.removeAt(index);
  }
  moveCustomLinkUp(index: number): void {
    if (index > 0) {
      const item = this.customLinks.at(index);
      this.customLinks.removeAt(index);
      this.customLinks.insert(index - 1, item);
      this.resumeForm.updateValueAndValidity();
    }
  }
  moveCustomLinkDown(index: number): void {
    if (index < this.customLinks.length - 1) {
      const item = this.customLinks.at(index);
      this.customLinks.removeAt(index);
      this.customLinks.insert(index + 1, item);
      this.resumeForm.updateValueAndValidity();
    }
  }

  createSection(type: SectionType, data?: ResumeSection): FormGroup {
    const sectionGroup = this.fb.group({
      id: [data?.id || this.generateUniqueId(), Validators.required],
      title: [data?.title || '', Validators.required],
      type: [type, Validators.required],

      items: this.fb.array(
        data?.items ? data.items.map((item) => this.createTimelineItem(item)) : [],
      ),
      skillTags: this.fb.array(
        data?.skillTags ? data.skillTags.map((skill) => this.createSkillItem(skill)) : [],
      ),
      customHtmlContent: [data?.customHtmlContent || ''],
    });

    if (type !== 'timeline') sectionGroup.get('items')?.disable({ emitEvent: false });
    if (type !== 'skills-grid') sectionGroup.get('skillTags')?.disable({ emitEvent: false });
    if (type !== 'custom-rich-text')
      sectionGroup.get('customHtmlContent')?.disable({ emitEvent: false });

    return sectionGroup;
  }

  addSection(): void {
    this.sections.push(
      this.createSection('timeline', {
        id: this.generateUniqueId(),
        title: 'New Timeline Section',
        type: 'timeline',
        items: [],
      }),
    );
  }

  removeSection(index: number): void {
    this.sections.removeAt(index);
  }
  moveSectionUp(index: number): void {
    if (index > 0) {
      const item = this.sections.at(index);
      this.sections.removeAt(index);
      this.sections.insert(index - 1, item);
      this.resumeForm.updateValueAndValidity();
    }
  }
  moveSectionDown(index: number): void {
    if (index < this.sections.length - 1) {
      const item = this.sections.at(index);
      this.sections.removeAt(index);
      this.sections.insert(index + 1, item);
      this.resumeForm.updateValueAndValidity();
    }
  }

  onSectionDrop(event: CdkDragDrop<unknown>): void {
    if (event.previousIndex === event.currentIndex) return;
    const item = this.sections.at(event.previousIndex);
    this.sections.removeAt(event.previousIndex, { emitEvent: false });
    this.sections.insert(event.currentIndex, item, { emitEvent: true });
    this.resumeForm.updateValueAndValidity();
  }

  onItemDrop(event: CdkDragDrop<unknown>, formArray: FormArray): void {
    if (event.previousIndex === event.currentIndex) return;
    const item = formArray.at(event.previousIndex);
    formArray.removeAt(event.previousIndex, { emitEvent: false });
    formArray.insert(event.currentIndex, item, { emitEvent: true });
    this.resumeForm.updateValueAndValidity();
  }

  onSectionTypeChange(index: number): void {
    const sectionGroup = this.sections.at(index) as FormGroup;
    const newType: SectionType = sectionGroup.get('type')?.value;

    sectionGroup.get('items')?.disable({ emitEvent: false });
    sectionGroup.get('skillTags')?.disable({ emitEvent: false });
    sectionGroup.get('customHtmlContent')?.disable({ emitEvent: false });

    switch (newType) {
      case 'timeline':
        sectionGroup.get('items')?.enable({ emitEvent: false });
        break;
      case 'skills-grid':
        sectionGroup.get('skillTags')?.enable({ emitEvent: false });
        break;
      case 'custom-rich-text':
        sectionGroup.get('customHtmlContent')?.enable({ emitEvent: false });
        break;
    }

    this.resumeForm.updateValueAndValidity();
  }

  getSectionItems(sectionIndex: number): FormArray {
    return this.sections.at(sectionIndex).get('items') as FormArray;
  }

  createTimelineItem(item?: TimelineItem): FormGroup {
    return this.fb.group({
      headline: [item?.headline || '', Validators.required],
      subheading: [item?.subheading || ''],
      date: [item?.date || ''],
      description: [item?.description || ''],
    });
  }

  addTimelineItem(sectionIndex: number): void {
    this.getSectionItems(sectionIndex).push(this.createTimelineItem());
  }
  removeTimelineItem(sectionIndex: number, itemIndex: number): void {
    this.getSectionItems(sectionIndex).removeAt(itemIndex);
  }
  moveTimelineItemUp(sectionIndex: number, itemIndex: number): void {
    if (itemIndex > 0) {
      const formArray = this.getSectionItems(sectionIndex);
      const item = formArray.at(itemIndex);
      formArray.removeAt(itemIndex);
      formArray.insert(itemIndex - 1, item);
      this.resumeForm.updateValueAndValidity();
    }
  }
  moveTimelineItemDown(sectionIndex: number, itemIndex: number): void {
    const formArray = this.getSectionItems(sectionIndex);
    if (itemIndex < formArray.length - 1) {
      const item = formArray.at(itemIndex);
      formArray.removeAt(itemIndex);
      formArray.insert(itemIndex + 1, item);
      this.resumeForm.updateValueAndValidity();
    }
  }

  getSectionSkills(sectionIndex: number): FormArray {
    return this.sections.at(sectionIndex).get('skillTags') as FormArray;
  }

  createSkillItem(skill?: SkillsGridItem): FormGroup {
    return this.fb.group({
      name: [skill?.name || '', Validators.required],
      level: [skill?.level || ''],
    });
  }

  addSkillItem(sectionIndex: number): void {
    this.getSectionSkills(sectionIndex).push(this.createSkillItem());
  }
  removeSkillItem(sectionIndex: number, skillIndex: number): void {
    this.getSectionSkills(sectionIndex).removeAt(skillIndex);
  }
  moveSkillItemUp(sectionIndex: number, skillIndex: number): void {
    if (skillIndex > 0) {
      const formArray = this.getSectionSkills(sectionIndex);
      const item = formArray.at(skillIndex);
      formArray.removeAt(skillIndex);
      formArray.insert(skillIndex - 1, item);
      this.resumeForm.updateValueAndValidity();
    }
  }
  moveSkillItemDown(sectionIndex: number, skillIndex: number): void {
    const formArray = this.getSectionSkills(sectionIndex);
    if (skillIndex < formArray.length - 1) {
      const item = formArray.at(skillIndex);
      formArray.removeAt(skillIndex);
      formArray.insert(skillIndex + 1, item);
      this.resumeForm.updateValueAndValidity();
    }
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
